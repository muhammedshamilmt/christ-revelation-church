import { NextResponse } from 'next/server';
import { INITIAL_SUBSCRIBERS } from '@/lib/mockData';

let mockSubscribers = [...INITIAL_SUBSCRIBERS];

export async function GET() {
  return NextResponse.json(mockSubscribers);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const newSub = {
      id: `sub-${Date.now()}`,
      email: body.email,
      status: 'Active',
      type: 'Weekly Newsletter',
      region: 'Europe',
      engagement: 'New',
      createdAt: new Date().toISOString(),
    };

    mockSubscribers = [newSub, ...mockSubscribers];
    return NextResponse.json(newSub, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
