import { Schema, model, Document } from 'mongoose';
import { ActivityType } from '../types';

export interface IActivityDocument extends Document {
  type: ActivityType;
  userId?: string;
  taskId?: string;
  description: string;
  timestamp: Date;
}

const activitySchema = new Schema<IActivityDocument>(
  {
    type: {
      type: String,
      enum: [
        'task_created',
        'task_updated',
        'task_moved',
        'task_deleted',
        'task_completed',
        'task_deployed',
        'user_joined',
        'user_left',
        'deployment_started',
        'deployment_completed',
        'deployment_failed',
      ],
      required: true,
      index: true,
    },
    userId: { type: String, index: true },
    taskId: { type: String, index: true },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false },
);

activitySchema.index({ timestamp: -1 });

export const Activity = model<IActivityDocument>('Activity', activitySchema);
export default Activity;
