import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { applyRateLimit, generalLimiter } from '@/lib/rateLimit';
import { verifyEmailSchema } from '@/lib/validation';

export async function POST(request: Request) {
  // Use generalLimiter so active admin sessions and React Strict Mode double-mounts are never 429-locked
  const rateLimitResponse = applyRateLimit(request, generalLimiter, 'auth:verify-email');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();

    // Validate input schema
    const parsed = verifyEmailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid email format' },
        { status: 400 }
      );
    }

    const targetEmail = parsed.data.email.trim().toLowerCase();

    // 1. Check Super Admins defined in NEXT_PUBLIC_ADMIN_EMAIL
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (adminEmails.includes(targetEmail)) {
      return NextResponse.json({
        success: true,
        role: 'Super Admin',
        permissions: ['all'],
        id: targetEmail,
      });
    }

    // 2. Check Subadmins in Supabase public.subadmins table
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });

      const { data: subadmin } = await supabaseAdmin
        .from('subadmins')
        .select('id, email, role, permissions')
        .ilike('email', targetEmail)
        .maybeSingle();

      if (subadmin) {
        let permissions: string[] = [];
        if (Array.isArray(subadmin.permissions)) {
          permissions = subadmin.permissions;
        } else if (typeof subadmin.permissions === 'string') {
          try {
            permissions = JSON.parse(subadmin.permissions);
          } catch {
            permissions = [];
          }
        }

        return NextResponse.json({
          success: true,
          role: subadmin.role || 'Admin',
          permissions,
          id: subadmin.id,
        });
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'This email is not authorized as an admin.',
      },
      { status: 403 }
    );
  } catch (error: any) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
