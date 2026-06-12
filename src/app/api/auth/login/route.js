import { NextResponse } from 'next/server';

export async function POST(request) {
  return NextResponse.json(
    { error: 'Utilisez le client Supabase directement' },
    { status: 400 }
  );
}