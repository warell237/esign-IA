import { NextResponse } from 'next/server';
import { sendToGemini } from '@/app/lib/gemini';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, mode, userId, history } = body;

    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Message et userId requis' },
        { status: 400 }
      );
    }

    // ============================================
    // 1. Récupérer les données utilisateur
    // ============================================
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    // ============================================
    // 2. Vérifier l'abonnement et le quota
    // ============================================
    const subscription = userData.subscription || {
      plan: 'free',
      questionsRemaining: 50,
      questionsUsed: 0,
      lastResetDate: new Date().toISOString().split('T')[0],
    };

    // Vérifier si on doit réinitialiser le quota quotidien
    const today = new Date().toISOString().split('T')[0];
    if (subscription.lastResetDate !== today) {
      subscription.questionsRemaining =
        subscription.plan === 'premium' ? Infinity : 10;
      subscription.questionsUsed = 0;
      subscription.lastResetDate = today;
      await updateDoc(userDocRef, {
        'subscription.questionsRemaining': subscription.questionsRemaining,
        'subscription.questionsUsed': subscription.questionsUsed,
        'subscription.lastResetDate': today,
      });
    }

    // Vérifier si l'utilisateur peut poser une question
    if (subscription.plan === 'free' && subscription.questionsRemaining <= 0) {
      return NextResponse.json(
        {
          error: 'QUOTA_EXCEEDED',
          message:
            'Vous avez utilisé toutes vos questions gratuites aujourd\'hui. Passez à Premium pour un accès illimité.',
        },
        { status: 403 }
      );
    }

    // ============================================
    // 3. Envoyer la question à Gemini
    // ============================================
    const result = await sendToGemini(message, mode || 'chat', userData, history || []);

    // ============================================
    // 4. Mettre à jour le quota
    // ============================================
    if (subscription.plan === 'free') {
      await updateDoc(userDocRef, {
        'subscription.questionsRemaining': subscription.questionsRemaining - 1,
        'subscription.questionsUsed': (subscription.questionsUsed || 0) + 1,
      });
    }

    // ============================================
    // 5. Sauvegarder dans l'historique
    // ============================================
    // (Optionnel - à implémenter selon besoin)

    return NextResponse.json({
      success: true,
      reply: result.reply,
      quota: {
        plan: subscription.plan,
        questionsRemaining:
          subscription.plan === 'premium'
            ? 'Illimité'
            : subscription.questionsRemaining - 1,
      },
    });
  } catch (error) {
    console.error('Erreur API Chat:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', message: error.message },
      { status: 500 }
    );
  }
}