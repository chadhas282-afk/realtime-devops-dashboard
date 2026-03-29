import { Schema, model, Document } from 'mongoose';
import { TaskStatus, TaskPriority } from '../types';

export interface ITaskDocument extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITaskDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['backlog', 'in-progress', 'testing', 'deployed'],
      default: 'backlog',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
    assignee: { type: String, trim: true },
    dueDate: { type: Date },
  },
  { timestamps: true },
);

taskSchema.index({ status: 1, priority: 1 });
taskSchema.index({ createdAt: -1 });

export const Task = model<ITaskDocument>('Task', taskSchema);
export default Task;
