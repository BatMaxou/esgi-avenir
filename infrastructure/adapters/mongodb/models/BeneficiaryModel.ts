import { Schema, model, Document } from "mongoose";

export interface BeneficiaryDocumentInterface extends Document {
  id: number;
  name: string;
  ownerId: number;
  accountId: number;
}

const beneficiarySchema = new Schema<BeneficiaryDocumentInterface>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    ownerId: {
      type: Number,
      required: true,
    },
    accountId: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BeneficiaryModel = model<BeneficiaryDocumentInterface>(
  "Beneficiary",
  beneficiarySchema
);
