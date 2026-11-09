import { NextResponse } from 'next/server';
import { INITIAL_CONTACTS } from '@/lib/mockData';
import { applyRateLimit, submitLimiter, generalLimiter } from '@/lib/rateLimit';
import { contactSchema } from '@/lib/validation';

let mockContacts = [...INITIAL_CONTACTS];

export async function GET(request: Request) {
  const rateLimitResponse = applyRateLimit(request, generalLimiter, 'contacts:get');
  if (rateLimitResponse) return rateLimitResponse;

  return NextResponse.json(mockContacts);
}

export async function POST(request: Request) {
  const rateLimitResponse = applyRateLimit(request, submitLimiter, 'contacts:submit');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const rawBody = await request.json();

    const parsed = contactSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid form input' },
        { status: 400 }
      );
    }

    const body = parsed.data;
    const avatar = body.name ? body.name.charAt(0).toUpperCase() : 'C';
    const newContact = {
      id: body.id || `cnt-${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      subject: body.subject || 'General Inquiry',
      message: body.message,
      category: 'Active Contacts',
      priority: 'Neutral',
      status: 'ACTIVE',
      avatar,
      color: 'bg-emerald-500',
      createdAt: new Date().toISOString(),
    };

    mockContacts = [newContact, ...mockContacts];
    return NextResponse.json(newContact, { status: 201 });
  } catch (error: any) {
    console.error('Contact submit error:', error);
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}
