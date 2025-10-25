import mongoose, { Schema, model, models } from "mongoose";

const KycSchema = new Schema({
    clerkId: {
        type: String,
        required: [true, "Clerk ID is required!"],
    },
    firstName: {
        type: String,
        required: [true, "First name is required!"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required!"],
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
    },
    country: {
        type: String,
        required: [true, "Country is required!"],
    },
    state: {
        type: String,
        required: [true, "State is required!"],
    },
    account: {
        type: String,
        required: [true, "Account is required!"],
    },
    approve: {
        type: String,
        required: [true, "Approval status is required!"],
    },
    balance: {
        type: String,
        required: [true, "Balance is required!"],
    },
    investment: {
        type: String,
        required: [true, "Investment is required!"],
    },
    applied: {
        type: String,
        required: [true, "Applied status is required!"],
    },
    idCard: {
        type: String,
        required: [true, "ID Card is required!"],
    },
    passport: {
        type: String,
        required: [true, "Passport is required!"],
    }
}, { timestamps: true });

const Kyc = models.Kyc || model('Kyc', KycSchema);
export default Kyc;