// src/app/api/user/investment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { clerkClient, getAuth } from '@clerk/nextjs/server'; // Updated import
import connectMongoDB from '@/lib/mongodb';
import Kyc from '@/models/kyc';

export async function GET(request: NextRequest) {
  try {
    // Get the current user's Clerk ID using getAuth
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    await connectMongoDB();

    // Find the user's KYC data by clerkId
    const userData = await Kyc.findOne({ clerkId: userId });

    if (!userData) {
      return NextResponse.json(
        { error: "User data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      investment: userData.investment || '0',
      firstName: userData.firstName || "Complete KYC",
      lastName: userData.lastName
    }, { status: 200 });

  } catch (error) {
    console.error('investment fetch error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}