import { Schema, model, Document } from "mongoose";

export interface CompanyMessageDocumentInterface extends Document {
  id: number;
  content: string;
  userId?: number;
  channelId?: number;
  createdAt: Date;
}

const companyMessageSchema = new Schema<CompanyMessageDocumentInterface>({
  id: { type: Number, required: true, unique: true },
  content: { type: String, required: true },
  userId: { type: Number },
  channelId: { type: Number },
  createdAt: { type: Date, required: true, default: Date.now },
});

export const CompanyMessageModel = model<CompanyMessageDocumentInterface>(
  "CompanyMessage",
  companyMessageSchema
);
