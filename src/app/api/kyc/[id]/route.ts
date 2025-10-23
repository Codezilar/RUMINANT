// src/app/api/kyc/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Kyc from '@/models/kyc';

// GET single KYC by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectMongoDB();
    
    const kycData = await Kyc.findById(id);
    
    if (!kycData) {
      return NextResponse.json({ error: "KYC not found" }, { status: 404 });
    }
    
    return NextResponse.json({ kyc: kycData }, { status: 200 });
  } catch (error) {
    console.error('KYC fetch error:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH to update KYC status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    await connectMongoDB();
    
    const updatedKyc = await Kyc.findByIdAndUpdate(
      id,
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