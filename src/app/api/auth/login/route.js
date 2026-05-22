import { NextResponse } from 'next/server';
import { loginUser } from '@/app/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, captchaToken } = body;

    // ============================================
    // 1. Validation basique
    // ============================================
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // ============================================
    // 2. Vérification hCaptcha (anti-robot)
    // ============================================
    if (!captchaToken) {
      return NextResponse.json(
        { error: 'Vérification anti-robot requise' },
        { status: 400 }
      );
    }

    const captchaResult = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `response=${captchaToken}&secret=${process.env.HCAPTCHA_SECRET_KEY}`,
    });

    const captchaData = await captchaResult.json();

    if (!captchaData.success) {
      return NextResponse.json(
        { error: 'Captcha invalide, réessaie' },
        { status: 400 }
      );
    }

    // ============================================
    // 3. Tentative de connexion
    // ============================================
    const result = await loginUser(email, password);

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
        { status: 401 }  // 401 = Unauthorized
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