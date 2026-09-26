import { NextResponse } from 'next/server';
import { INITIAL_TRANSACTIONS } from '@/lib/mockData';

let mockTransactions = [...INITIAL_TRANSACTIONS];

export async function GET() {
  return NextResponse.json(mockTransactions);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const avatar = body.name ? body.name.charAt(0).toUpperCase() : (body.isAnonymous ? 'A' : 'U');
    const colors = ['bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const newTxn = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      name: body.isAnonymous ? 'Anonymous Donor' : (body.name || 'Supporter'),
      email: body.email || 'donor@crc.org',
      amount: typeof body.amount === 'number' ? `£${body.amount.toFixed(2)}` : (body.amount || '£50.00'),
      currency: body.currency || 'GBP',
      currencySymbol: body.currencySymbol || '£',
      designation: body.designation || 'General Ministry',
      status: 'Completed',
      date: new Date().toISOString(),
      avatar,
      color,
      isAnonymous: Boolean(body.isAnonymous),
      campaign_id: body.campaignId || null,
    };

    mockTransactions = [newTxn, ...mockTransactions];
    return NextResponse.json(newTxn, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
