import mongoose, { Document, Schema } from 'mongoose';

export interface IFormat extends Document {
  clerkId: string;
  title: string;
  description: string;
  form_id: string;
  approved: boolean;
  type: 'first' | 'second' | 'third'; // To distinguish between first and second format
  createdAt: Date;
  updatedAt: Date;
}

const FormatSchema: Schema = new Schema({
  clerkId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  form_id: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['first', 'second', 'third'],
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Format || mongoose.model<IFormat>('Format', FormatSchema);