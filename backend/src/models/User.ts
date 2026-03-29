import { Schema, model, Document } from 'mongoose';
import { UserStatus } from '../types';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  avatar?: string;
  status: UserStatus;
  onlineAt?: Date;
  lastSeen?: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    avatar: { type: String },
    status: {
      type: String,
      enum: ['online', 'away', 'busy', 'offline'],
      default: 'offline',
      index: true,
    },
    onlineAt: { type: Date },
    lastSeen: { type: Date },
  },
  { timestamps: true },
);

export const User = model<IUserDocument>('User', userSchema);
export default User;
