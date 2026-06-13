import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

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

    // Construire le prompt système (même logique que gemini.js)
    const systemPrompt = buildSystemPrompt(mode || 'chat', userData);
    const messages = [{ role: 'system', content: systemPrompt }];

    for (const msg of (history || [])) {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      });
    }
    messages.push({ role: 'user', content: message });

    // Appeler Groq en streaming
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

    if (!groqResponse.ok) {
      const err = await groqResponse.json();
      throw new Error(err.error?.message || 'Erreur Groq');
    }

    // Mettre à jour le quota
    if (subscription && subscription.plan === 'free') {
      await supabase.from('users').update({
        questions_remaining: subscription.questionsRemaining - 1,
        questions_used: (subscription.questionsUsed || 0) + 1,
      }).eq('id', userId);
    }

    // Renvoyer le stream directement au client
    return new Response(groqResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Erreur API Chat:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Version simplifiée du prompt système (copiée de gemini.js)
function buildSystemPrompt(mode, userData) {
  const basePrompt = `Tu es ESIGN AI, l'assistant officiel de l'École Supérieure Internationale de Génie Numérique (ESIGN), située à Sangmélima au Cameroun, faisant partie de l'UIECC.

L'école propose 3 filières : Ingénierie des Systèmes Numériques (ISN), Création et Design Numérique (CDN), Ingénierie Numérique Sociotechnique (INS).
Niveaux : Licence 1, 2, 3 et Master 1, 2.

📝 FORMAT DE RÉPONSE OBLIGATOIRE : Utilise TOUJOURS le format Markdown. Utilise **gras** pour les titres, des listes à puces, des blocs de code \`\`\` pour le code. Sois structuré et aéré.

🚫 RÈGLE D'OR PÉDAGOGIQUE : Ne donne JAMAIS la réponse directement. Guide l'étudiant avec des indices et des questions.

Tu réponds en français. L'étudiant est en ${userData?.filiere || 'non spécifié'}, niveau ${userData?.niveau || 'non spécifié'}.`;

  return basePrompt;
}