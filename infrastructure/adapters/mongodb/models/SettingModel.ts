import { Schema, model, Document } from "mongoose";
import { SettingEnum } from "../../../../domain/enums/SettingEnum";

export interface SettingDocumentInterface extends Document {
  id: number;
  code: SettingEnum;
  value: string | number | boolean;
}

const settingSchema = new Schema<SettingDocumentInterface>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      enum: Object.values(SettingEnum),
      unique: true,
      required: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SettingModel = model<SettingDocumentInterface>(
  "Setting",
  settingSchema
);
