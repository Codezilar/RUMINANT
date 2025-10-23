// app/api/displayFormat/withdrawal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Format from '@/models/Format';

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();

    // Extract clerkId from query parameters
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');
    
    if (!clerkId) {
      return NextResponse.json({
        success: false,
        message: 'clerkId is required'
      }, { status: 400 });
    }

    // Find withdrawal data for the specific user
    const format = await Format.findOne({ clerkId });
    
    console.log('Withdrawal data found:', format);
    
    if (!format) {
      return NextResponse.json({
        success: true,
        format: null,
        message: 'No format data found'
      }, { status: 200 });
    }
    
    return NextResponse.json({
      success: true,
      format
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching format data:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch format data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}