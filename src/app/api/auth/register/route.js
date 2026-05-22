import { NextResponse } from 'next/server';
import { registerUser } from '@/app/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, filiere, niveau, matricule, phone } = body;

    // Validation basique
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      );
    }
    //verification robot
     if (!captchaToken) {
      return NextResponse.json(
        { error: 'Vérification anti-robot requise' },
        { status: 400 }
      )
    }

    const captchaResult = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `response=${captchaToken}&secret=${process.env.HCAPTCHA_SECRET_KEY}`
    })
    
    const captchaData = await captchaResult.json()

    if (!captchaData.success) {
      return NextResponse.json(
        { error: 'Captcha invalide, réessaie' },
        { status: 400 }
      )
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
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
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