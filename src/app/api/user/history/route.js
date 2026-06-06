import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// Récupérer l'historique
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

    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json(
        { error: 'Erreur serveur' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      conversations,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Sauvegarder une conversation
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, title, messages, mode } = body;

    if (!userId || !messages) {
      return NextResponse.json(
        { error: 'userId et messages requis' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        title: title || 'Nouvelle conversation',
        messages,
        mode: mode || 'chat',
        rating: null,
        feedback: '',
        rated_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Erreur serveur' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      conversationId: data.id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}