import { NextResponse } from 'next/server';
import { INITIAL_CONTACTS } from '@/lib/mockData';

let mockContacts = [...INITIAL_CONTACTS];

export async function GET() {
  return NextResponse.json(mockContacts);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const avatar = body.name ? body.name.charAt(0).toUpperCase() : 'C';
    const newContact = {
      id: `cnt-${Date.now()}`,
      name: body.name || 'Anonymous',
      email: body.email || 'contact@crc.org',
      phone: body.phone || null,
      subject: body.subject || 'General Inquiry',
      message: body.message || '',
      category: 'Active Contacts',
      priority: 'Neutral',
      status: 'ACTIVE',
      avatar,
      color: 'bg-emerald-500',
      createdAt: new Date().toISOString(),
    };

    mockContacts = [newContact, ...mockContacts];
    return NextResponse.json(newContact, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}
