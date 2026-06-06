import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

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
    const { data: convData, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single();

    if (convError || !convData) {
      return NextResponse.json(
        { error: 'Conversation non trouvée' },
        { status: 404 }
      );
    }

    if (convData.rating) {
      return NextResponse.json(
        { error: 'Cette conversation a déjà été notée' },
        { status: 400 }
      );
    }

    // ============================================
    // 3. Mettre à jour la conversation
    // ============================================
    await supabase
      .from('conversations')
      .update({
        rating,
        feedback: feedback || '',
        rated_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    // ============================================
    // 4. Récupérer et mettre à jour les stats utilisateur
    // ============================================
    const { data: userData } = await supabase
      .from('users')
      .select('ratings_total, ratings_sum, points')
      .eq('id', userId)
      .single();

    const currentTotal = userData?.ratings_total || 0;
    const currentSum = userData?.ratings_sum || 0;
    const currentPoints = userData?.points || 0;

    const newTotal = currentTotal + 1;
    const newSum = currentSum + rating;
    const average = (newSum / newTotal).toFixed(1);
    const pointsEarned = 10;

    await supabase
      .from('users')
      .update({
        ratings_total: newTotal,
        ratings_sum: newSum,
        points: currentPoints + pointsEarned,
      })
      .eq('id', userId);

    // ============================================
    // 5. Retourner le résultat
    // ============================================
    return NextResponse.json({
      success: true,
      message: getRatingMessage(rating),
      stats: {
        rating,
        feedback: feedback || '',
        average: parseFloat(average),
        totalRatings: newTotal,
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

    const { data: userData, error } = await supabase
      .from('users')
      .select('ratings_total, ratings_sum')
      .eq('id', userId)
      .single();

    if (error || !userData) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const average = userData.ratings_total > 0
      ? (userData.ratings_sum / userData.ratings_total).toFixed(1)
      : null;

    return NextResponse.json({
      success: true,
      stats: {
        total: userData.ratings_total || 0,
        sum: userData.ratings_sum || 0,
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
    1: "😞 Désolé que ça n'ait pas aidé. On va s'améliorer.",
    2: '😕 Merci pour ton retour, on travaille dessus.',
    3: '😊 Merci ! On continue de progresser.',
    4: "😄 Super ! Content que ça t'ait aidé.",
    5: '🤩 Excellent ! Ravis de t\'avoir aidé à fond !',
  };
  return messages[rating] || 'Merci pour ton retour !';
}