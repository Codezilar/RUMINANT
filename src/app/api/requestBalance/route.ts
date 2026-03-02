// src/app/api/requestBalance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import connectMongoDB from '@/lib/mongodb';
import Withdrawal from '@/models/Withdrawal'; 

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectMongoDB();

    // Tell Mongoose what type to return
    const userData = await Withdrawal.findOne<{ amount?: string }>({ clerkId: userId }).lean();

    const amount = userData?.amount ?? '0';

    return NextResponse.json({ amount: String(amount) }, { status: 200 });
  } catch (error) {
    console.error('requestBalance error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
