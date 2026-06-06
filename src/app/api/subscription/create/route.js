import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, plan, paymentMethod, phoneNumber } = body;

    const plans = {
      monthly: {
        name: 'Premium Mensuel',
        price: 1000,
        duration: 30,
        questions: 'Illimité',
      },
      yearly: {
        name: 'Premium Annuel',
        price: 10000,
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
    const transactionId = uuidv4();
    const paymentSuccess = true;

    if (paymentSuccess) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        return NextResponse.json(
          { error: 'Utilisateur non trouvé' },
          { status: 404 }
        );
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + selectedPlan.duration);

      await supabase
        .from('users')
        .update({
          subscription_plan: 'premium',
          subscription_type: plan,
          questions_remaining: null,
          questions_used: 0,
          last_reset_date: new Date().toISOString().split('T')[0],
          subscription_start: startDate.toISOString(),
          subscription_end: endDate.toISOString(),
          transaction_id: transactionId,
          payment_method: paymentMethod,
          amount: selectedPlan.price,
        })
        .eq('id', userId);

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