import { Schema, model, Document } from "mongoose";

export interface MonthlyPaymentDocumentInterface extends Document {
  id: number;
  amount: number;
  createdAt: Date;
  bankCreditId: number;
}

const monthlyPaymentSchema = new Schema<MonthlyPaymentDocumentInterface>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    bankCreditId: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MonthlyPaymentModel = model<MonthlyPaymentDocumentInterface>(
  "MonthlyPayment",
  monthlyPaymentSchema
);
