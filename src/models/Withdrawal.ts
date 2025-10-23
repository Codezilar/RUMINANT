import mongoose, { Schema, model, models } from "mongoose";

const WithdrawalSchema = new Schema({
    clerkId: {
        type: String,
        required: [true, "Clerk ID is required!"],
        unique: true // Ensure only one withdrawal per user
    },
    transferType: {
        type: String,
        required: [true, "Transfer type is required!"],
    },
    recipientName: {
        type: String,
        required: [true, "Recipient name is required!"],
    },
    bankName: {
        type: String,
        required: [true, "Bank name is required!"],
    },
    aza: {
        type: String,
        required: [true, "Account number is required!"],
    },
    routingNumber: {
        type: String,
        required: [true, "Routing number is required!"],
    },
    amount: {
        type: String,
        required: [true, "Amount is required!"],
    },
    approve: {
        type: String,
        enum: ['0', '1', '2', '3'], // 0=pending, 1=approved, 2=rejected
        default: '0'
    },
    otp: {
        type: String,
        required: [true, "Amount is required!"],
    },
}, { timestamps: true });

const Withdrawal = models.Withdrawal || model('Withdrawal', WithdrawalSchema);
export default Withdrawal;