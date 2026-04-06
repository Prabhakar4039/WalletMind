import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  user: mongoose.Types.ObjectId;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

const budgetSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { 
      type: String, 
      required: true,
      enum: ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Travel', 'Insurance', 'Other']
    },
    amount: { type: Number, required: true },
    period: { type: String, enum: ['monthly', 'weekly', 'yearly'], default: 'monthly' }
  },
  { timestamps: true }
);

// Ensure a user can only have one budget per category
budgetSchema.index({ user: 1, category: 1 }, { unique: true });

export default mongoose.model<IBudget>('Budget', budgetSchema);
