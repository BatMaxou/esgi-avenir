import { Schema, model, Document } from "mongoose";
import { StockOrderStatusEnum } from "../../../../domain/enums/StockOrderStatusEnum";
import { StockOrderTypeEnum } from "../../../../domain/enums/StockOrderTypeEnum";

export interface StockOrderDocumentInterface extends Document {
  id: number;
  amount: number;
  type: StockOrderTypeEnum;
  status: StockOrderStatusEnum;
  purchasePrice?: number;
  ownerId: number;
  stockId: number;
  accountId: number;
}

const stockOrderSchema = new Schema<StockOrderDocumentInterface>(
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
    type: {
      type: String,
      enum: Object.values(StockOrderTypeEnum),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(StockOrderStatusEnum),
      required: true,
    },
    purchasePrice: {
      type: Number,
      required: false,
    },
    ownerId: {
      type: Number,
      required: true,
    },
    stockId: {
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

export const StockOrderModel = model<StockOrderDocumentInterface>(
  "StockOrder",
  stockOrderSchema
);
