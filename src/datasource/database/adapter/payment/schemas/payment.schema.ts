import { Schema } from 'mongoose';

export const PaymentSchema = new Schema({
  method: { type: String, required: true },
  value: { type: Number, required: true },
  status: { type: String, required: true },
  externalId: { type: String },
  pixQrCode: { type: String },
  createdAt: { type: Date, default: Date.now },
});
