import { NextResponse } from 'next/server';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, plan, paymentMethod, phoneNumber } = body;

    // Plans disponibles
    const plans = {
      monthly: {
        name: 'Premium Mensuel',
        price: 1000, // FCFA
        duration: 30, // jours
        questions: 'Illimité',
      },
      yearly: {
        name: 'Premium Annuel',
        price: 10000, // FCFA
        duration: 365,
        questions: 'Illimité',
      },
    };

    if (!plans[plan]) {
      return NextResponse.json(
        { error: 'Plan invalide' },
        { status: 400 }
      );
    }

    const selectedPlan = plans[plan];

    // ============================================
    // Simuler un paiement Mobile Money
    // En production, intégrer Orange Money / MTN MoMo API
    // ============================================
    const transactionId = uuidv4();
    const paymentSuccess = true; // Simuler réussite

    if (paymentSuccess) {
      // Mettre à jour l'abonnement utilisateur
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        return NextResponse.json(
          { error: 'Utilisateur non trouvé' },
          { status: 404 }
        );
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + selectedPlan.duration);

      await updateDoc(userDocRef, {
        subscription: {
          plan: 'premium',
          planType: plan,
          questionsRemaining: 'Illimité',
          questionsUsed: 0,
          lastResetDate: new Date().toISOString().split('T')[0],
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          transactionId,
          paymentMethod,
          amount: selectedPlan.price,
        },
      });

      // Enregistrer le paiement
      const paymentRef = doc(db, 'payments', transactionId);
      const { setDoc } = await import('firebase/firestore');
      await setDoc(paymentRef, {
        userId,
        transactionId,
        plan,
        amount: selectedPlan.price,
        paymentMethod,
        phoneNumber,
        status: 'success',
        createdAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: `Abonnement ${selectedPlan.name} activé avec succès !`,
        transactionId,
        endDate: endDate.toISOString(),
      });
    } else {
      return NextResponse.json(
        { error: 'Paiement échoué' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur', message: error.message },
      { status: 500 }
    );
  }
}