import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';
import { buildSystemPrompt } from '../../lib/gemini';

// ============================================
// Mettre à jour les stats Mentor
// ============================================
async function updateMentorStats(userId) {
  if (!userId) return;

  const { data: userData } = await supabase
    .from('users')
    .select('mentor_sessions, mentor_streak, mentor_last_active')
    .eq('id', userId)
    .single();

  if (!userData) return;

  const today = new Date().toISOString().split('T')[0];
  const lastActive = userData.mentor_last_active || today;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let newStreak = userData.mentor_streak || 0;

  if (lastActive === today) {
    // Déjà actif aujourd'hui → on garde la streak
  } else if (lastActive === yesterday) {
    // Actif hier → +1 jour
    newStreak += 1;
  } else {
    // Inactif → reset
    newStreak = 1;
  }

  await supabase
    .from('users')
    .update({
      mentor_sessions: (userData.mentor_sessions || 0) + 1,
      mentor_streak: newStreak,
      mentor_last_active: today,
    })
    .eq('id', userId);
}

// ============================================
// Mettre à jour les stats Examen
// ============================================
async function updateExamStats(userId, replyText) {
  if (!userId) return;

  // Détecter si la réponse contient une note (ex: "Note : 14/20")
  const noteMatch = replyText?.match(/Note\s*:\s*(\d+)\s*\/\s*20/);
  if (!noteMatch) return;

  const note = parseInt(noteMatch[1]);

  const { data: userData } = await supabase
    .from('users')
    .select('exam_done, exam_average, exam_best_matiere')
    .eq('id', userId)
    .single();

  if (!userData) return;

  const newTotal = (userData.exam_done || 0) + 1;
  const newSum = (userData.exam_average || 0) * (userData.exam_done || 0) + note;
  const newAverage = Math.round((newSum / newTotal) * 10) / 10;

  await supabase
    .from('users')
    .update({
      exam_done: newTotal,
      exam_average: newAverage,
    })
    .eq('id', userId);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, mode, userId, history } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }

    // Récupérer les données utilisateur
    let userData = null;
    if (userId) {
      const { data } = await supabase.from('users').select('*').eq('id', userId).single();
      if (data) userData = data;
    }

    // Vérifier le quota
    const subscription = userData
      ? {
          plan: userData.subscription_plan || 'free',
          questionsRemaining: userData.questions_remaining ?? 10,
          questionsUsed: userData.questions_used || 0,
          lastResetDate: userData.last_reset_date || new Date().toISOString().split('T')[0],
        }
      : null;

    const today = new Date().toISOString().split('T')[0];
    if (subscription && subscription.lastResetDate !== today) {
      subscription.questionsRemaining = subscription.plan === 'premium' ? Infinity : 10;
      subscription.questionsUsed = 0;
      subscription.lastResetDate = today;
      await supabase.from('users').update({
        questions_remaining: subscription.plan === 'premium' ? null : 10,
        questions_used: 0,
        last_reset_date: today,
      }).eq('id', userId);
    }

    if (subscription && subscription.plan === 'free' && subscription.questionsRemaining <= 0) {
      return NextResponse.json({
        error: 'QUOTA_EXCEEDED',
        message: 'Vous avez utilisé toutes vos questions gratuites aujourd\'hui. Passez à Premium.',
      }, { status: 403 });
    }

    // Construire le prompt système
    const systemPrompt = buildSystemPrompt(mode || 'chat', userData, message);
    const messages = [{ role: 'system', content: systemPrompt }];

    for (const msg of (history || [])) {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      });
    }
    messages.push({ role: 'user', content: message });

    // Mettre à jour le quota
    if (subscription && subscription.plan === 'free') {
      await supabase.from('users').update({
        questions_remaining: subscription.questionsRemaining - 1,
        questions_used: (subscription.questionsUsed || 0) + 1,
      }).eq('id', userId);
    }

    // Mettre à jour les stats selon le mode
    if (mode === 'mentor') {
      await updateMentorStats(userId);
    }

    // Essayer Groq d'abord (streaming)
    try {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: messages,
          temperature: 0.8,
          max_tokens: 2048,
          top_p: 0.9,
          stream: true,
        }),
      });

      if (groqResponse.ok) {
        return new Response(groqResponse.body, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      }
    } catch (groqError) {
      console.error('Groq échoué, tentative Gemini:', groqError.message);
    }

    // Fallback Gemini
    try {
      const systemMsg = messages.find(m => m.role === 'system');
      const otherMsgs = messages.filter(m => m.role !== 'system');

      const contents = [];
      if (systemMsg) {
        contents.push({ role: 'user', parts: [{ text: systemMsg.content }] });
        contents.push({ role: 'model', parts: [{ text: 'Compris.' }] });
      }
      for (const msg of otherMsgs) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }

      const geminiResponse = await fetch(
        `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: { temperature: 0.8, maxOutputTokens: 2048 },
          }),
        }
      );

      if (!geminiResponse.ok) {
        const err = await geminiResponse.json();
        throw new Error(err.error?.message || 'Erreur Gemini');
      }

      const data = await geminiResponse.json();
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      // Mettre à jour les stats Examen si une note est détectée
      if (mode === 'exam') {
        await updateExamStats(userId, replyText);
      }

      return NextResponse.json({ success: true, reply: replyText });

    } catch (geminiError) {
      console.error('Gemini échoué:', geminiError.message);
      return NextResponse.json(
        { error: 'Tous les fournisseurs IA sont indisponibles. Réessaie.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Erreur API Chat:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}