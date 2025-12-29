import { Schema, model, Document } from "mongoose";

export interface FinancialSecurityDocumentInterface extends Document {
  id: number;
  purchasePrice: number;
  ownerId: number;
  stockId: number;
}

const financialSecuritySchema = new Schema<FinancialSecurityDocumentInterface>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
    },
    ownerId: {
      type: Number,
      required: true,
    },
    stockId: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FinancialSecurityModel = model<FinancialSecurityDocumentInterface>(
  "FinancialSecurity",
  financialSecuritySchema
);
