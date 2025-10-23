// src/app/api/withdrawal/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Withdrawal from '@/models/Withdrawal';
import Kyc from '@/models/kyc';

function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const clerkId = formData.get('clerkId') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const transferType = formData.get('transferType') as string;
    const recipientName = formData.get('recipientName') as string;
    const bankName = formData.get('bankName') as string;
    const aza = formData.get('aza') as string;
    const routingNumber = formData.get('routingNumber') as string;

    if (!clerkId || !amount || !transferType || !recipientName || !bankName || !aza || !routingNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectMongoDB();

    // 1. Get the user's current balance - use findOne instead of find
    const kycData = await Kyc.findOne({ clerkId });

    if (!kycData) {
      return NextResponse.json({ error: "Complete KYC before withdrawing" }, { status: 403 });
    }

    // Convert to plain object and handle balance
    const kycPlain = kycData.toObject ? kycData.toObject() : kycData;
    const currentBalance = parseFloat(kycPlain.balance || '0');

    // 2. Check if withdrawal amount is allowed
    if (amount > currentBalance) {
      return NextResponse.json(
        { error: `Insufficient balance. You only have $${currentBalance.toFixed(2)}` },
        { status: 400 }
      );
    }

    // 3. If valid, create/update withdrawal
    const existingWithdrawal = await Withdrawal.findOne({ clerkId });
    const otp = generateOTP();

    const withdrawalData = {
      clerkId,
      amount,
      transferType,
      recipientName,
      bankName,
      aza,
      routingNumber,
      approve: "0",
      otp,
    };

    let result;
    if (existingWithdrawal) {
      result = await Withdrawal.findOneAndUpdate(
        { clerkId },
        withdrawalData,
        { new: true, runValidators: true }
      );
    } else {
      result = await Withdrawal.create(withdrawalData);
    }

    return NextResponse.json(
      {
        message: existingWithdrawal
          ? "Withdrawal Updated Successfully"
          : "Withdrawal Request Submitted",
        accountNumber: aza,
        approve: "0",
        otp,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Withdrawal submission error:", error);

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();
    
    const withdrawalData = await Withdrawal.find({}).sort({ createdAt: -1 }).lean();
    
    const serializedData = withdrawalData.map(doc => ({
      clerkId: doc.clerkId,
      amount: doc.amount,
      transferType: doc.transferType,
      recipientName: doc.recipientName,
      bankName: doc.bankName,
      aza: doc.aza,
      routingNumber: doc.routingNumber,
      approve: doc.approve || '0',
      otp: doc.otp,
      createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: doc.updatedAt?.toISOString() || new Date().toISOString()
    }));
    
    return NextResponse.json({ withdrawals: serializedData }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching withdrawal data:', error);
    return NextResponse.json(
      { error: 'Complete KYC!' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { clerkId, action } = await request.json();

    if (!clerkId || !action) {
      return NextResponse.json(
        { error: "Missing clerkId or action parameter" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const updateData = {
      approve: '3',
      updatedAt: new Date()
    };

    const updatedWithdrawal = await Withdrawal.findOneAndUpdate(
      { clerkId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedWithdrawal) {
      return NextResponse.json(
        { error: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: `Withdrawal ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        withdrawal: updatedWithdrawal
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Withdrawal update error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}