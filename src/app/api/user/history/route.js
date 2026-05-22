import { NextResponse } from 'next/server';
import {
  doc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

// Récupérer l'historique
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const mode = searchParams.get('mode') || 'chat';

    if (!userId) {
      return NextResponse.json(
        { error: 'userId requis' },
        { status: 400 }
      );
    }

    // Récupérer les 50 dernières conversations
    const conversationsRef = collection(db, 'users', userId, 'conversations');
    const q = query(
      conversationsRef,
      orderBy('updatedAt', 'desc'),
      limit(50)
    );

    const querySnapshot = await getDocs(q);
    const conversations = [];

    querySnapshot.forEach((doc) => {
      conversations.push({
        id: doc.id,
        ...doc.data(),
      });
    });

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

    const conversationsRef = collection(db, 'users', userId, 'conversations');
    const docRef = await addDoc(conversationsRef, {
      title: title || 'Nouvelle conversation',
      messages,
      mode: mode || 'chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      conversationId: docRef.id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
  const docRef = await addDoc(conversationsRef, {
  title: title || 'Nouvelle conversation',
  messages,
  mode: mode || 'chat',
  rating: null,              // ✅ AJOUTER
  feedback: '',              // ✅ AJOUTER
  ratedAt: null,             // ✅ AJOUTER
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
}