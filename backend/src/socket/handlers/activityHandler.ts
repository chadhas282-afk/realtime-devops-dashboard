import { Socket, Server } from 'socket.io';
import { Activity } from '../../models/Activity';
import logger from '../../utils/logger';
import { ActivityType } from '../../types';

export function registerActivityHandlers(io: Server, socket: Socket): void {
  socket.on(
    'activity:log',
    async (
      data: { type: ActivityType; taskId?: string; description: string },
      callback?: (result: unknown) => void,
    ) => {
      try {
        const activity = await Activity.create({
          type: data.type,
          userId: socket.data.userId,
          taskId: data.taskId,
          description: data.description,
        });

        io.emit('activity:new', activity);
        logger.info('Activity logged', { type: data.type });
        if (typeof callback === 'function') callback({ success: true, activity });
      } catch (error) {
        logger.error('Socket activity:log error', error);
        if (typeof callback === 'function') callback({ success: false, error: 'Failed to log activity' });
      }
    },
  );
}
