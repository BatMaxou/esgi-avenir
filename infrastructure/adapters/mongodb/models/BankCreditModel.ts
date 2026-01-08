import { Schema, model, Document } from "mongoose";
import { BankCreditStatusEnum } from "../../../../domain/enums/BankCreditStatusEnum";

export interface BankCreditDocumentInterface extends Document {
  id: number;
  amount: number;
  insurancePercentage: number;
  interestPercentage: number;
  durationInMonths: number;
  status: BankCreditStatusEnum;
  accountId: number;
  advisorId: number;
  ownerId: number;
}

const bankCreditSchema = new Schema<BankCreditDocumentInterface>(
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
    insurancePercentage: {
      type: Number,
      required: true,
    },
    interestPercentage: {
      type: Number,
      required: true,
    },
    durationInMonths: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BankCreditStatusEnum),
      required: true,
    },
    accountId: {
      type: Number,
      required: true,
    },
    advisorId: {
      type: Number,
      required: true,
    },
    ownerId: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BankCreditModel = model<BankCreditDocumentInterface>(
  "BankCredit",
  bankCreditSchema
);
