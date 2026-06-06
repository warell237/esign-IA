import { NextResponse } from 'next/server';
import { getUserData } from '../../../lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { uid } = body;

    if (!uid) {
      return NextResponse.json(
        { error: 'UID requis' },
        { status: 400 }
      );
    }

    const result = await getUserData(uid);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}