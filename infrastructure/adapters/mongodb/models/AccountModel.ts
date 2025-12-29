import { Schema, model, Document } from "mongoose";

export interface AccountDocumentInterface extends Document {
  id: number;
  iban: string;
  name: string;
  ownerId: number;
  isSavings: boolean;
  isDeleted: boolean;
}

const accountSchema = new Schema<AccountDocumentInterface>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    iban: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    ownerId: {
      type: Number,
      required: true,
    },
    isSavings: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const AccountModel = model<AccountDocumentInterface>(
  "Account",
  accountSchema
);
