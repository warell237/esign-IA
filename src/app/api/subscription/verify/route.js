import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// Cache simple en mémoire pour éviter des hits DB répétitifs en dev
const cache = new Map(); // key: userId -> { ts, subscription }
const TTL_MS = 30 * 1000; // 30 secondes

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) return NextResponse.json({ error: 'userId requis' }, { status: 400 });

    // Vérifier cache
    const cached = cache.get(userId);
    const now = Date.now();
    if (cached && now - cached.ts < TTL_MS) {
      console.log('subscription/verify: cache hit for', userId);
      return NextResponse.json({ success: true, subscription: cached.subscription });
    }

    console.time('subscription.verify.db');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    console.timeEnd('subscription.verify.db');

    if (userError || !userData) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Expiration automatique
    if (userData.subscription_plan === 'premium' && userData.subscription_end) {
      const nowDate = new Date();
      const endDate = new Date(userData.subscription_end);

      if (nowDate > endDate) {
        await supabase
          .from('users')
          .update({
            subscription_plan: 'free',
            questions_remaining: 10,
            questions_used: 0,
            last_reset_date: new Date().toISOString().split('T')[0],
            subscription_end: null,
          })
          .eq('id', userId);

        const subscription = { plan: 'free', questionsRemaining: 10, expired: true };
        cache.set(userId, { ts: Date.now(), subscription });
        return NextResponse.json({ success: true, subscription });
      }
    }

    const subscription = {
      plan: userData.subscription_plan,
      questionsRemaining: userData.questions_remaining,
      endDate: userData.subscription_end,
    };

    cache.set(userId, { ts: Date.now(), subscription });

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error('subscription/verify error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}