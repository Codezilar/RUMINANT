import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Kyc from "@/models/kyc";
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from "@/lib/cloudinary";

// Generate random 10-digit account number
const generateAccountNumber = (): string => {
  const min = 1000000000;
  const max = 9999999999;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

export async function POST(request: NextRequest) {
  try {
    console.log("📨 KYC submission received");

    const formData = await request.formData();

    // Validate required text fields
    const requiredFields = [
      "clerkId", "firstName", "lastName", "email", "country", "state", 
      "idCardFileName", "passportFileName"
    ];

    const missingFields = requiredFields.filter(field => {
      const value = formData.get(field);
      return !value || (value instanceof File && value.size === 0);
    });

    if (missingFields.length > 0) {
      console.error("❌ Missing required fields:", missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Extract values
    const clerkId = formData.get("clerkId") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const country = formData.get("country") as string;
    const state = formData.get("state") as string;
    const idCard = formData.get("idCardFileName") as File;
    const passport = formData.get("passportFileName") as File;

    // Optional numeric defaults
    const investment = (formData.get("investment") as string) || "0";
    const applied = "1";
    let account = "";
    let balance = "0";

    // File size validation
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (idCard.size > MAX_FILE_SIZE || passport.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    await connectMongoDB();
    console.log("✅ Connected to MongoDB");

    // Check for existing KYC
    const existingKyc = await Kyc.findOne({ clerkId });

    if (existingKyc) {
      account = existingKyc.account;
      balance = existingKyc.balance;

      // Delete old files (if any)
      const deletions = [];
      if (existingKyc.idCard) {
        const idPublic = getPublicIdFromUrl(existingKyc.idCard);
        if (idPublic) deletions.push(deleteFromCloudinary(idPublic));
      }
      if (existingKyc.passport) {
        const passPublic = getPublicIdFromUrl(existingKyc.passport);
        if (passPublic) deletions.push(deleteFromCloudinary(passPublic));
      }
      await Promise.allSettled(deletions);
    } else {
      account = generateAccountNumber();
    }

    // Upload new files
    const idCardBuffer = Buffer.from(await idCard.arrayBuffer());
    const passportBuffer = Buffer.from(await passport.arrayBuffer());

    const uploadWithRetry = async (buffer: Buffer, folder: string, filename: string, retries = 3) => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(`📤 Upload attempt ${attempt} for ${folder}`);
          return await uploadToCloudinary(buffer, folder, filename);
        } catch (err) {
          if (attempt === retries) throw err;
          console.warn(`⚠️ Retry upload ${attempt} failed, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
      throw new Error("All upload attempts failed");
    };

    const [idCardUpload, passportUpload] = await Promise.all([
      uploadWithRetry(idCardBuffer, "id_cards", `${clerkId}_idcard`),
      uploadWithRetry(passportBuffer, "passports", `${clerkId}_passport`)
    ]);

    console.log("✅ Files uploaded successfully");

    // KYC payload
    const kycData = {
      clerkId,
      firstName,
      lastName,
      email,
      country,
      state,
      account,
      approve: "0",
      balance,
      investment,
      applied,
      idCard: idCardUpload.secure_url,
      passport: passportUpload.secure_url,
    };

    // Create or update
    let result;
    if (existingKyc) {
      result = await Kyc.findOneAndUpdate({ clerkId }, kycData, { new: true, runValidators: true });
      console.log("✅ KYC record updated");
    } else {
      result = await Kyc.create(kycData);
      console.log("✅ New KYC record created");
    }

    return NextResponse.json(
      {
        message: existingKyc ? "KYC Updated Successfully" : "KYC Submitted Successfully",
        accountNumber: account,
        isReapplication: !!existingKyc,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("❌ KYC submission error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json({ error: "Validation failed. Please check your input." }, { status: 400 });
    }

    if (error.code === 11000) {
      return NextResponse.json({ error: "KYC application already exists for this user." }, { status: 409 });
    }

    return NextResponse.json({ error: "Internal server error. Please try again later." }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    const kycData = await Kyc.find({}).sort({ createdAt: -1 }).lean();

    const serialized = kycData.map(doc => ({
      clerkId: doc.clerkId,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      country: doc.country,
      state: doc.state,
      account: doc.account,
      approve: doc.approve || "0",
      balance: doc.balance || "0",
      investment: doc.investment || "0",
      idCard: doc.idCard,
      passport: doc.passport,
      createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: doc.updatedAt?.toISOString() || new Date().toISOString(),
    }));

    return NextResponse.json({ kyc: serialized }, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching KYC data:", err);
    return NextResponse.json({ error: "Failed to fetch KYC data" }, { status: 500 });
  }
}

// Disable default body parsing (for form-data)
export const config = {
  api: { bodyParser: false },
};
