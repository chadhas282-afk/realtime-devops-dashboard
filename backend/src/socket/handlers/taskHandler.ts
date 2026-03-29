import { Socket, Server } from 'socket.io';
import { Task } from '../../models/Task';
import { Activity } from '../../models/Activity';
import logger from '../../utils/logger';

export function registerTaskHandlers(io: Server, socket: Socket): void {
  socket.on('task:create', async (data, callback) => {
    try {
      const task = new Task(data);
      await task.save();

      const activity = await Activity.create({
        type: 'task_created',
        userId: socket.data.userId,
        taskId: String(task._id),
        description: `Task "${task.title}" was created`,
      });

      io.emit('task:created', task);
      io.emit('activity:new', activity);
      logger.info('Socket task:create', { taskId: task._id });
      if (typeof callback === 'function') callback({ success: true, task });
    } catch (error) {
      logger.error('Socket task:create error', error);
      if (typeof callback === 'function') callback({ success: false, error: 'Failed to create task' });
    }
  });

  socket.on('task:update', async (data: { id: string; [key: string]: unknown }, callback) => {
    try {
      const { id, ...updates } = data;
      const task = await Task.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

      if (!task) {
        if (typeof callback === 'function') callback({ success: false, error: 'Task not found' });
        return;
      }

      const activityType = updates.status === 'deployed' ? 'task_deployed' :
        updates.status === 'testing' || updates.status === 'in-progress' ? 'task_moved' : 'task_updated';

      const activity = await Activity.create({
        type: activityType,
        userId: socket.data.userId,
        taskId: String(task._id),
        description: `Task "${task.title}" was ${activityType.replace('task_', '')}`,
      });

      io.emit('task:updated', task);
      io.emit('activity:new', activity);
      logger.info('Socket task:update', { taskId: task._id });
      if (typeof callback === 'function') callback({ success: true, task });
    } catch (error) {
      logger.error('Socket task:update error', error);
      if (typeof callback === 'function') callback({ success: false, error: 'Failed to update task' });
    }
  });

  socket.on('task:delete', async (data: { id: string }, callback) => {
    try {
      const task = await Task.findByIdAndDelete(data.id);

      if (!task) {
        if (typeof callback === 'function') callback({ success: false, error: 'Task not found' });
        return;
      }

      const activity = await Activity.create({
        type: 'task_deleted',
        userId: socket.data.userId,
        taskId: data.id,
        description: `Task "${task.title}" was deleted`,
      });

      io.emit('task:deleted', { id: data.id });
      io.emit('activity:new', activity);
      logger.info('Socket task:delete', { taskId: data.id });
      if (typeof callback === 'function') callback({ success: true });
    } catch (error) {
      logger.error('Socket task:delete error', error);
      if (typeof callback === 'function') callback({ success: false, error: 'Failed to delete task' });
    }
  });
}
