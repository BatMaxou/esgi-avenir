import { Schema, model, Document } from "mongoose";

export interface PrivateChannelDocumentInterface extends Document {
  id: number;
  title: string;
  userId?: number;
  advisorId?: number;
}

const privateChannelSchema = new Schema<PrivateChannelDocumentInterface>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  userId: { type: Number },
  advisorId: { type: Number },
});

export const PrivateChannelModel = model<PrivateChannelDocumentInterface>(
  "PrivateChannel",
  privateChannelSchema
);
