import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  amount: string;
  paymentId: string;
  status: 'success' | 'failed' | 'pending';
  declineReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  amount: { type: String, required: true },
  paymentId: { type: String, required: true },
  status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
  declineReason: { type: String },
}, {
  timestamps: true,
});

export const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
