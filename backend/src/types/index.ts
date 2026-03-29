export type TaskStatus = 'backlog' | 'in-progress' | 'testing' | 'deployed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type UserStatus = 'online' | 'away' | 'busy' | 'offline';
export type DeploymentStatus = 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
export type ActivityType =
  | 'task_created'
  | 'task_updated'
  | 'task_moved'
  | 'task_deleted'
  | 'task_completed'
  | 'task_deployed'
  | 'user_joined'
  | 'user_left'
  | 'deployment_started'
  | 'deployment_completed'
  | 'deployment_failed';

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivity {
  _id: string;
  type: ActivityType;
  userId?: string;
  taskId?: string;
  description: string;
  timestamp: Date;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  status: UserStatus;
  onlineAt?: Date;
  lastSeen?: Date;
}

export interface IDeployment {
  _id: string;
  name: string;
  status: DeploymentStatus;
  timestamp: Date;
  details?: string;
  environment: string;
}

export interface AuthenticatedRequest extends Express.Request {
  user?: { id: string; email: string; name: string };
}

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; name: string };
    }
  }
}
