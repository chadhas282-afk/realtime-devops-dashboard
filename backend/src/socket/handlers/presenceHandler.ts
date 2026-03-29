import { Socket, Server } from 'socket.io';
import { User } from '../../models/User';
import { Activity } from '../../models/Activity';
import logger from '../../utils/logger';
import { UserStatus } from '../../types';

export function registerPresenceHandlers(io: Server, socket: Socket): void {
  socket.on('user:join', async (data: { userId: string; name: string; email: string }) => {
    try {
      socket.data.userId = data.userId;
      socket.data.name = data.name;

      const user = await User.findOneAndUpdate(
        { email: data.email },
        { name: data.name, email: data.email, status: 'online', onlineAt: new Date() },
        { upsert: true, new: true },
      );

      const activity = await Activity.create({
        type: 'user_joined',
        userId: data.userId,
        description: `${data.name} joined the dashboard`,
      });

      io.emit('user:online', user);
      io.emit('activity:new', activity);
      logger.info('User joined', { userId: data.userId, name: data.name });
    } catch (error) {
      logger.error('Socket user:join error', error);
    }
  });

  socket.on('user:leave', async () => {
    await handleUserLeave(io, socket);
  });

  socket.on('presence:update', async (data: { status: UserStatus }) => {
    try {
      if (!socket.data.userId) return;

      const user = await User.findOneAndUpdate(
        { _id: socket.data.userId },
        { status: data.status },
        { new: true },
      );

      if (user) {
        io.emit('presence:updated', { userId: socket.data.userId, status: data.status });
        logger.info('Presence updated', { userId: socket.data.userId, status: data.status });
      }
    } catch (error) {
      logger.error('Socket presence:update error', error);
    }
  });

  socket.on('disconnect', async () => {
    await handleUserLeave(io, socket);
  });
}

async function handleUserLeave(io: Server, socket: Socket): Promise<void> {
  try {
    if (!socket.data.userId) return;

    const user = await User.findOneAndUpdate(
      { _id: socket.data.userId },
      { status: 'offline', lastSeen: new Date() },
      { new: true },
    );

    if (user) {
      const activity = await Activity.create({
        type: 'user_left',
        userId: socket.data.userId,
        description: `${socket.data.name || 'A user'} left the dashboard`,
      });

      io.emit('user:offline', { userId: socket.data.userId });
      io.emit('activity:new', activity);
      logger.info('User left', { userId: socket.data.userId });
    }
  } catch (error) {
    logger.error('Socket disconnect error', error);
  }
}
