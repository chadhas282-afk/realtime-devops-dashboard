import { Schema, model, Document } from 'mongoose';
import { DeploymentStatus } from '../types';

export interface IDeploymentDocument extends Document {
  name: string;
  status: DeploymentStatus;
  timestamp: Date;
  details?: string;
  environment: string;
}

const deploymentSchema = new Schema<IDeploymentDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    status: {
      type: String,
      enum: ['pending', 'running', 'success', 'failed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    timestamp: { type: Date, default: Date.now, index: true },
    details: { type: String, trim: true, maxlength: 1000 },
    environment: {
      type: String,
      enum: ['development', 'staging', 'production'],
      default: 'development',
    },
  },
  { timestamps: true },
);

deploymentSchema.index({ timestamp: -1 });

export const Deployment = model<IDeploymentDocument>('Deployment', deploymentSchema);
export default Deployment;
