import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json({
    success: true,
    role: 'Super Admin',
    permissions: ['all'],
    id: 'sub-1',
  });
}
