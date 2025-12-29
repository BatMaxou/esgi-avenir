import { Schema, model, Document } from "mongoose";

export interface CompanyChannelDocumentInterface extends Document {
  id: number;
  title: string;
}

const companyChannelSchema = new Schema<CompanyChannelDocumentInterface>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
});

export const CompanyChannelModel = model<CompanyChannelDocumentInterface>(
  "CompanyChannel",
  companyChannelSchema
);
