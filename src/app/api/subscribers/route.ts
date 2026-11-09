import { NextResponse } from 'next/server';
import { INITIAL_SUBSCRIBERS } from '@/lib/mockData';
import { applyRateLimit, subscribeLimiter, generalLimiter } from '@/lib/rateLimit';
import { subscriberSchema } from '@/lib/validation';

let mockSubscribers = [...INITIAL_SUBSCRIBERS];

export async function GET(request: Request) {
  const rateLimitResponse = applyRateLimit(request, generalLimiter, 'subscribers:get');
  if (rateLimitResponse) return rateLimitResponse;

  return NextResponse.json(mockSubscribers);
}

export async function POST(request: Request) {
  const rateLimitResponse = applyRateLimit(request, subscribeLimiter, 'subscribers:submit');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const rawBody = await request.json();

    const parsed = subscriberSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const newSub = {
      id: `sub-${Date.now()}`,
      email,
      status: 'Active',
      type: 'Weekly Newsletter',
      region: 'Europe',
      engagement: 'New',
      createdAt: new Date().toISOString(),
    };

    mockSubscribers = [newSub, ...mockSubscribers];
    return NextResponse.json(newSub, { status: 201 });
  } catch (error: any) {
    console.error('Subscriber error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
