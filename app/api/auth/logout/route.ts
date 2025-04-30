import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/session';

export async function POST(request: Request) {
  await deleteSession();

  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/login`);
}