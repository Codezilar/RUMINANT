// src/app/api/kyc/[clerkId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Kyc from '@/models/kyc';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clerkId: string }> }
) {
  try {
    const { clerkId } = await params;

    if (!clerkId) {
      return NextResponse.json(
        { error: "Clerk ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Use findOne with clerkId field instead of findById
    const kycData = await Kyc.findOne({ clerkId });

    if (!kycData) {
      return NextResponse.json(
        { error: "KYC data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { kyc: kycData },
      { status: 200 }
    );
  } catch (error) {
    console.error('KYC fetch error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH to update KYC status by clerkId
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ clerkId: string }> }
) {
  try {
    const { clerkId } = await params;
    const body = await request.json();
    
    await connectMongoDB();
    
    // Use findOneAndUpdate with clerkId
    const updatedKyc = await Kyc.findOneAndUpdate(
      { clerkId },
      { approve: body.approve },
      { new: true, runValidators: true }
    );
    
    if (!updatedKyc) {
      return NextResponse.json({ error: "KYC not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "KYC status updated successfully", 
      kyc: updatedKyc 
    }, { status: 200 });
  } catch (error) {
    console.error('KYC update error:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}