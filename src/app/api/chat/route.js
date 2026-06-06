import { NextResponse } from 'next/server';
import { sendToGemini } from '../../lib/gemini';
import { supabase } from '../../lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, mode, userId, history } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      );
    }

    // Si on a un userId, chercher en base. Sinon on traitera comme invité.
    let userData = null;
    if (userId) {
      const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
      if (!error && data) userData = data;
      else userData = null;
    }

    // ============================================
    // 2. Vérifier l'abonnement et le quota
    // ============================================
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

      await supabase
        .from('users')
        .update({
          questions_remaining: subscription.plan === 'premium' ? null : 10,
          questions_used: 0,
          last_reset_date: today,
        })
        .eq('id', userId);
    }

    if (subscription && subscription.plan === 'free' && subscription.questionsRemaining <= 0) {
      return NextResponse.json(
        {
          error: 'QUOTA_EXCEEDED',
          message: 'Vous avez utilisé toutes vos questions gratuites aujourd\'hui. Passez à Premium pour un accès illimité.',
        },
        { status: 403 }
      );
    }

    // ============================================
    // 3. Envoyer la question à Gemini
    // ============================================
    const result = await sendToGemini(message, mode || 'chat', userData, history || []);

    if (!result || result.success === false) {
      console.error('Gemini error:', result?.error);
      return NextResponse.json({ error: 'AI_ERROR', message: result?.error || 'Erreur du service IA' }, { status: 502 });
    }

    // Mettre à jour le quota uniquement si on a un utilisateur
    let quota = null;
    if (subscription) {
      if (subscription.plan === 'free') {
        await supabase
          .from('users')
          .update({
            questions_remaining: subscription.questionsRemaining - 1,
            questions_used: (subscription.questionsUsed || 0) + 1,
          })
          .eq('id', userId);
      }

      quota = {
        plan: subscription.plan,
        questionsRemaining: subscription.plan === 'premium' ? 'Illimité' : subscription.questionsRemaining - 1,
      };
    }

    return NextResponse.json({
      success: true,
      reply: result.reply,
      quota,
    });
  } catch (error) {
    console.error('Erreur API Chat:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', message: error.message },
      { status: 500 }
    );
  }
}