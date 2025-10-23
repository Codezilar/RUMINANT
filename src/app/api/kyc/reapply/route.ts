import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Kyc from '@/models/kyc';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '@/lib/cloudinary';

export async function PUT(request: NextRequest) {
  try {
    console.log('📨 KYC reapplication received');
    
    const formData = await request.formData();
    
    // Extract form data
    const clerkId = formData.get('clerkId') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const country = formData.get('country') as string;
    const state = formData.get('state') as string;
    const idCard = formData.get('idCardFileName') as File;
    const passport = formData.get('passportFileName') as File;

    // Validate required fields
    if (!clerkId || !firstName || !lastName || !email || !country || !state) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      );
    }

    await connectMongoDB();
    console.log('✅ Connected to MongoDB');

    // Find existing KYC record
    const existingKyc = await Kyc.findOne({ clerkId });
    if (!existingKyc) {
      console.error('❌ KYC record not found for clerkId:', clerkId);
      return NextResponse.json(
        { error: "KYC record not found. Please complete a new KYC application first." }, 
        { status: 404 }
      );
    }

    console.log('📝 Existing KYC found, updating...');

    // Update basic information
    existingKyc.firstName = firstName;
    existingKyc.lastName = lastName;
    existingKyc.email = email;
    existingKyc.country = country;
    existingKyc.state = state;
    
    // Reset approval status for reapplication
    existingKyc.approve = "0";
    existingKyc.applied = "1";
    existingKyc.updatedAt = new Date();

    // Handle file uploads if new files are provided
    const uploadPromises = [];

    if (idCard && idCard.size > 0) {
      console.log('📤 New ID card provided, processing...');
      
      // Validate file size
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (idCard.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "ID card file size too large. Maximum size is 10MB" }, 
          { status: 400 }
        );
      }

      // Remove old ID card file from Cloudinary if it exists
      if (existingKyc.idCard) {
        const publicId = getPublicIdFromUrl(existingKyc.idCard);
        if (publicId) {
          console.log(`🗑️ Deleting old ID card: ${publicId}`);
          uploadPromises.push(
            deleteFromCloudinary(publicId)
              .catch(error => console.warn('Could not delete old ID card:', error))
          );
        }
      }
      
      // Process new ID card
      const idCardBuffer = Buffer.from(await idCard.arrayBuffer());
      uploadPromises.push(
        (async () => {
          try {
            const idCardUpload = await uploadToCloudinary(
              idCardBuffer, 
              'id_cards', 
              `${clerkId}_idcard_${Date.now()}`
            );
            existingKyc.idCard = idCardUpload.secure_url;
            console.log('✅ ID card uploaded successfully');
          } catch (uploadError) {
            console.error('❌ Error uploading ID card:', uploadError);
            throw new Error('Failed to upload ID card');
          }
        })()
      );
    }

    if (passport && passport.size > 0) {
      console.log('📤 New passport provided, processing...');
      
      // Validate file size
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (passport.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "Passport file size too large. Maximum size is 10MB" }, 
          { status: 400 }
        );
      }

      // Remove old passport file from Cloudinary if it exists
      if (existingKyc.passport) {
        const publicId = getPublicIdFromUrl(existingKyc.passport);
        if (publicId) {
          console.log(`🗑️ Deleting old passport: ${publicId}`);
          uploadPromises.push(
            deleteFromCloudinary(publicId)
              .catch(error => console.warn('Could not delete old passport:', error))
          );
        }
      }
      
      // Process new passport
      const passportBuffer = Buffer.from(await passport.arrayBuffer());
      uploadPromises.push(
        (async () => {
          try {
            const passportUpload = await uploadToCloudinary(
              passportBuffer, 
              'passports', 
              `${clerkId}_passport_${Date.now()}`
            );
            existingKyc.passport = passportUpload.secure_url;
            console.log('✅ Passport uploaded successfully');
          } catch (uploadError) {
            console.error('❌ Error uploading passport:', uploadError);
            throw new Error('Failed to upload passport');
          }
        })()
      );
    }

    // Wait for all file operations to complete
    if (uploadPromises.length > 0) {
      console.log('⏳ Processing file uploads...');
      const results = await Promise.allSettled(uploadPromises);
      
      // Check for any upload errors
      const uploadErrors = results.filter(result => 
        result.status === 'rejected'
      ) as PromiseRejectedResult[];
      
      if (uploadErrors.length > 0) {
        console.error('❌ File upload errors:', uploadErrors);
        return NextResponse.json(
          { error: "Failed to upload files. Please try again." }, 
          { status: 500 }
        );
      }
    }

    // Save updated KYC record
    try {
      await existingKyc.save();
      console.log('✅ KYC record updated successfully');
      
      return NextResponse.json(
        { 
          message: "KYC Updated Successfully",
          accountNumber: existingKyc.account
        }, 
        { status: 200 }
      );
    } catch (saveError: any) {
      console.error('❌ Error saving KYC record:', saveError);
      
      if (saveError.name === 'ValidationError') {
        const validationErrors = Object.values(saveError.errors).map((e: any) => ({
          field: e.path,
          message: e.message
        }));
        
        return NextResponse.json(
          { 
            error: "Validation Failed", 
            details: validationErrors 
          }, 
          { status: 400 }
        );
      }
      
      throw saveError;
    }

  } catch (error: any) {
    console.error('❌ KYC reapplication error:', error);
    
    return NextResponse.json(
      { error: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};