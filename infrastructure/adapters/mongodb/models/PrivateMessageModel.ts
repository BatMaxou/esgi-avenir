import { Schema, model, Document } from "mongoose";

export interface PrivateMessageDocumentInterface extends Document {
  id: number;
  content: string;
  userId?: number;
  channelId?: number;
  createdAt: Date;
}

const privateMessageSchema = new Schema<PrivateMessageDocumentInterface>({
  id: { type: Number, required: true, unique: true },
  content: { type: String, required: true },
  userId: { type: Number },
  channelId: { type: Number },
  createdAt: { type: Date, required: true, default: Date.now },
});

export const PrivateMessageModel = model<PrivateMessageDocumentInterface>(
  "PrivateMessage",
  privateMessageSchema
);
