// src/app/api/kyc/transfer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Kyc from '@/models/kyc';

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

    // Update the investment
    const currentinvestment = parseFloat(user.investment) || 0;
    const newinvestment = currentinvestment + amount;

    const updatedUser = await Kyc.findOneAndUpdate(
      { account },
      { investment: newinvestment.toString() },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Investment updated successfully",
      userName: `${updatedUser.firstName} ${updatedUser.lastName}`,
      newinvestment: updatedUser.investment
    }, { status: 200 });

  } catch (error) {
    console.error('Transfer error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}