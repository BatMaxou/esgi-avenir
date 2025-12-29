import { Schema, model, Document } from "mongoose";
import { OperationEnum } from "../../../../domain/enums/OperationEnum";

export interface OperationDocumentInterface extends Document {
  id: number;
  amount: number;
  type: OperationEnum;
  name?: string;
  createdAt: Date;
  fromId?: number;
  toId?: number;
}

const operationSchema = new Schema<OperationDocumentInterface>(
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
      enum: Object.values(OperationEnum),
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    fromId: {
      type: Number,
      required: false,
    },
    toId: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const OperationModel = model<OperationDocumentInterface>(
  "Operation",
  operationSchema
);
