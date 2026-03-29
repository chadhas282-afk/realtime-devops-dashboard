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

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  _id: string;
  type: ActivityType;
  userId?: string;
  taskId?: string;
  description: string;
  timestamp: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  status: UserStatus;
  onlineAt?: string;
  lastSeen?: string;
}

export interface Deployment {
  _id: string;
  name: string;
  status: DeploymentStatus;
  timestamp: string;
  details?: string;
  environment: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
