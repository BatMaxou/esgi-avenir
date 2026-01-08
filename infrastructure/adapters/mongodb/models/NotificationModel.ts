import { Schema, model, Document } from "mongoose";

export interface NotificationDocumentInterface extends Document {
  id: number;
  content: string;
  advisorId?: number;
  userId?: number;
  createdAt: Date;
}

const notificationSchema = new Schema<NotificationDocumentInterface>({
  id: { type: Number, required: true, unique: true },
  content: { type: String, required: true },
  advisorId: { type: Number },
  userId: { type: Number },
  createdAt: { type: Date, required: true, default: Date.now },
});

export const NotificationModel = model<NotificationDocumentInterface>(
  "Notification",
  notificationSchema
);
