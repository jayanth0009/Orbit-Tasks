import { Schema, model } from 'mongoose';

export interface UserDocument {
  email: string;
  passwordHash: string;
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

export const User = model<UserDocument>('User', userSchema);

