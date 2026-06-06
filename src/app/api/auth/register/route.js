import { NextResponse } from 'next/server';
import { registerUser } from '../../../lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, filiere, niveau, matricule, phone } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit faire au moins 6 caractères' },
        { status: 400 }
      );
    }

    const result = await registerUser(email, password, {
      firstName,
      lastName,
      filiere,
      niveau,
      matricule,
      phone,
    });

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