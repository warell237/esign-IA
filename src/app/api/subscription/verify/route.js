import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId } = body;

    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const subscription = userData.subscription;

    // Vérifier si l'abonnement a expiré
    if (subscription.plan === 'premium' && subscription.endDate) {
      const now = new Date();
      const endDate = new Date(subscription.endDate);

      if (now > endDate) {
        // Rétrograder en gratuit
        await updateDoc(userDocRef, {
          subscription: {
            plan: 'free',
            questionsRemaining: 10,
            questionsUsed: 0,
            lastResetDate: new Date().toISOString().split('T')[0],
            startDate: subscription.startDate,
            endDate: null,
          },
        });

        return NextResponse.json({
          success: true,
          subscription: {
            plan: 'free',
            questionsRemaining: 10,
            expired: true,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}