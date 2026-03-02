// app/api/displayFormat/withdrawal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Withdrawal from '@/models/Withdrawal';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clerkId: string }> }
) {
  try {
    const { clerkId } = await params;

    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: "Clerk ID is required" }, // Add success field
        { status: 400 }
      );
    }

    await connectMongoDB();

    const withdrawalData = await Withdrawal.findOne({ clerkId });

    if (!withdrawalData) {
      return NextResponse.json(
        { success: false, error: "Withdrawal data not found" }, // Add success field
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, // Add success field
        withdrawal: withdrawalData // Change from kyc to withdrawal
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Withdrawal fetch error:', error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" }, // Add success field
      { status: 500 }
    );
  }
}