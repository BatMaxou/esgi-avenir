import { Schema, model } from "mongoose";

interface IdCounterInterface {
  _id: string;
  sequence_value: number;
}

const counterSchema = new Schema<IdCounterInterface>({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 },
});

export const CounterModel = model<IdCounterInterface>("Counter", counterSchema);

export async function getNextSequence(sequenceName: string): Promise<number> {
  const counter = await CounterModel.findByIdAndUpdate(
    sequenceName,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );

  return counter!.sequence_value;
}
