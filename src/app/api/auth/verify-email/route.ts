import { NextResponse } from 'next/server';
import { applyRateLimit, authLimiter } from '@/lib/rateLimit';
import { verifyEmailSchema } from '@/lib/validation';

export async function POST(request: Request) {
  // 1. Enforce strict rate limit on auth attempts: 5 requests / 15 minutes per IP
  const rateLimitResponse = applyRateLimit(request, authLimiter, 'auth:verify-email');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();

    // 2. Validate input schema
    const parsed = verifyEmailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid email format' },
        { status: 400 }
      );
    }

    const targetEmail = parsed.data.email;

    // 3. Check only authorized admins defined in NEXT_PUBLIC_ADMIN_EMAIL
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);

    if (adminEmails.includes(targetEmail)) {
      return NextResponse.json({
        success: true,
        role: 'Super Admin',
        permissions: ['all'],
        id: targetEmail,
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'This email is not authorized as an admin.' 
    }, { status: 403 });

  } catch (error: any) {
    console.error('Verify email error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
