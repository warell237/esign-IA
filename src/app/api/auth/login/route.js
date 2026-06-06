import { NextResponse } from 'next/server';
import { loginUser } from '../../../lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const result = await loginUser(email, password);

    if (result.success) {
      return NextResponse.json({
        success: true,
        user: {
          uid: result.user.id,
          email: result.user.email,
        },
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Erreur API Login:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', message: error.message },
      { status: 500 }
    );
  }
}