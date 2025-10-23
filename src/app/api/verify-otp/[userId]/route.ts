import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Withdrawal from '@/models/Withdrawal';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Await the params promise
    const resolvedParams = await params;
    const { userId } = resolvedParams;
    
    console.log('Extracted userId:', userId);
    
    const { otp } = await req.json();
    console.log('Received OTP:', otp);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!otp) {
      return NextResponse.json(
        { success: false, error: "OTP is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    
    // Find the withdrawal record
    const withdrawal = await Withdrawal.findOne({ clerkId: userId });
    
    if (!withdrawal) {
      return NextResponse.json(
        { success: false, error: "Withdrawal record not found" },
        { status: 404 }
      );
    }

    // Check if the withdrawal record has an OTP field
    if (!withdrawal.otp) {
      return NextResponse.json(
        { success: false, error: "No OTP found for this withdrawal" },
        { status: 400 }
      );
    }

    // Check if entered OTP matches the OTP in database
    if (otp === withdrawal.otp) {
      // Update withdrawal status to 1 (approved/verified)
      withdrawal.approve = '1';
      await withdrawal.save();
      
      return NextResponse.json({ 
        success: true, 
        message: "OTP verified successfully" 
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid OTP" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
