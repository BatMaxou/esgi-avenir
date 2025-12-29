import { Schema, model, Document } from "mongoose";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";

export interface UserDocumentInterface extends Document {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: RoleEnum[];
  enabled: boolean;
  confirmationToken: string | null;
  isDeleted: boolean;
}

const userSchema = new Schema<UserDocumentInterface>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      required: true,
    },
    enabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    confirmationToken: {
      type: String,
      default: null,
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

export const UserModel = model<UserDocumentInterface>("User", userSchema);
