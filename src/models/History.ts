import mongoose, { Schema, model, models } from "mongoose";

const HistorySchema = new Schema({
    clerkId: {
        type: String,
        required: [true, "Clerk ID is required!"],
    },
    amount: {
        type: String,
        required: [true, "Amount is required!"],
    },
}, { timestamps: true });

const History = models.History || model('History', HistorySchema);
export default History;