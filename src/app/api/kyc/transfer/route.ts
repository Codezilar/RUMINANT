// src/app/api/kyc/transfer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Kyc from '@/models/kyc';
import History from '@/models/History';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { account, amount } = body;

    if (!account || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valid account number and amount are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Find the user by account number
    const user = await Kyc.findOne({ account });

    if (!user) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    // Update the balance
    const currentBalance = parseFloat(user.balance) || 0;
    const newBalance = currentBalance + amount;

    const updatedUser = await Kyc.findOneAndUpdate(
      { account },
      { balance: newBalance.toString() },
      { new: true, runValidators: true }
    );

    // Create transaction history record using your simple schema
    const historyRecord = new History({
      clerkId: user.clerkId,
      amount: amount.toString()
    });

    await historyRecord.save();

    return NextResponse.json({
      message: "Balance updated successfully",
      userName: `${updatedUser.firstName} ${updatedUser.lastName}`,
      newBalance: updatedUser.balance
    }, { status: 200 });

  } catch (error) {
    console.error('Transfer error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}