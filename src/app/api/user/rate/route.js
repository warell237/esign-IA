import { NextResponse } from 'next/server';
import { doc, updateDoc, getDoc, increment } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, conversationId, rating, feedback } = body;

    // ============================================
    // 1. Validation
    // ============================================
    if (!userId || !conversationId || !rating) {
      return NextResponse.json(
        { error: 'userId, conversationId et rating requis' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'La note doit être entre 1 et 5' },
        { status: 400 }
      );
    }

    if (feedback && feedback.length > 500) {
      return NextResponse.json(
        { error: 'Le commentaire ne doit pas dépasser 500 caractères' },
        { status: 400 }
      );
    }

    // ============================================
    // 2. Vérifier que la conversation existe
    // ============================================
    const convRef = doc(db, 'users', userId, 'conversations', conversationId);
    const convSnap = await getDoc(convRef);

    if (!convSnap.exists()) {
      return NextResponse.json(
        { error: 'Conversation non trouvée' },
        { status: 404 }
      );
    }

    const convData = convSnap.data();

    // Empêcher de noter deux fois
    if (convData.rating) {
      return NextResponse.json(
        { error: 'Cette conversation a déjà été notée' },
        { status: 400 }
      );
    }

    // ============================================
    // 3. Mettre à jour la conversation
    // ============================================
    await updateDoc(convRef, {
      rating,
      feedback: feedback || '',
      ratedAt: new Date().toISOString(),
    });

    // ============================================
    // 4. Mettre à jour les stats de l'utilisateur
    // ============================================
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      'gamification.ratings.total': increment(1),
      'gamification.ratings.sum': increment(rating),
    });

    // Récupérer les stats mises à jour
    const userSnap = await getDoc(userRef);
    const gamification = userSnap.data().gamification?.ratings || { total: 0, sum: 0 };
    const average = gamification.total > 0
      ? (gamification.sum / gamification.total).toFixed(1)
      : rating;

    // ============================================
    // 5. Ajouter des points de récompense
    // ============================================
    const pointsEarned = 10; // 10 points par notation

    await updateDoc(userRef, {
      'gamification.points': increment(pointsEarned),
    });

    // ============================================
    // 6. Retourner le résultat
    // ============================================
    return NextResponse.json({
      success: true,
      message: getRatingMessage(rating),
      stats: {
        rating,
        feedback: feedback || '',
        average,
        totalRatings: gamification.total,
        pointsEarned,
      },
    });

  } catch (error) {
    console.error('Erreur API Rate:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', message: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// Récupérer les notes d'un utilisateur
// ============================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId requis' },
        { status: 400 }
      );
    }

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const gamification = userSnap.data().gamification?.ratings || {
      total: 0,
      sum: 0,
    };

    const average = gamification.total > 0
      ? (gamification.sum / gamification.total).toFixed(1)
      : null;

    return NextResponse.json({
      success: true,
      stats: {
        total: gamification.total,
        sum: gamification.sum,
        average: average ? parseFloat(average) : null,
      },
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// ============================================
// Message personnalisé selon la note
// ============================================
function getRatingMessage(rating) {
  const messages = {
    1: '😞 Désolé que ça n\'ait pas aidé. On va s\'améliorer.',
    2: '😕 Merci pour ton retour, on travaille dessus.',
    3: '😊 Merci ! On continue de progresser.',
    4: '😄 Super ! Content que ça t\'ait aidé.',
    5: '🤩 Excellent ! Ravis de t\'avoir aidé à fond !',
  };
  return messages[rating] || 'Merci pour ton retour !';
}