import { Schema, model, Document } from "mongoose";

export interface StockDocumentInterface extends Document {
  id: number;
  name: string;
  baseQuantity: number;
  basePrice: number;
  disabled: boolean;
}

const stockSchema = new Schema<StockDocumentInterface>(
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
    baseQuantity: {
      type: Number,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const StockModel = model<StockDocumentInterface>("Stock", stockSchema);
