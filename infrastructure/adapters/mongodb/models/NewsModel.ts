import { Schema, model, Document } from "mongoose";

export interface NewsDocumentInterface extends Document {
  id: number;
  title: string;
  content: string;
  authorId?: number;
  createdAt: Date;
}

const newsSchema = new Schema<NewsDocumentInterface>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: Number },
  createdAt: { type: Date, required: true, default: Date.now },
});

export const NewsModel = model<NewsDocumentInterface>("News", newsSchema);
