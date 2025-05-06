import { login } from '@/app/api/auth/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const result = await login(formData);

    if (result?.errors) {
      return NextResponse.json({ errors: result.errors }, { status: 400 });
    }

    return NextResponse.json({ success: true, token: result.token }, { status: 200 });
  } catch (error) {
    console.error('API Login Error:', error);
    return NextResponse.json(
      { errors: { general: ['An unexpected error occurred. Please try again.'] } },
      { status: 500 }
    );
  }
}