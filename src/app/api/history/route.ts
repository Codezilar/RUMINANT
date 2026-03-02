// src/app/api/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import History from '@/models/History';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse.json(
        { error: "Clerk ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Fetch transactions for the specific clerkId, sorted by most recent first
    const transactions = await History.find({ clerkId })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({
      transactions: transactions.map(transaction => ({
        _id: transaction._id.toString(),
        clerkId: transaction.clerkId,
        amount: transaction.amount,
        createdAt: transaction.createdAt.toISOString(),
      }))
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}