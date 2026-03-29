import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import logger from '../utils/logger';
import { registerTaskHandlers } from './handlers/taskHandler';
import { registerActivityHandlers } from './handlers/activityHandler';
import { registerPresenceHandlers } from './handlers/presenceHandler';

export function initializeSocket(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket: Socket) => {
    logger.info('Socket connected', { socketId: socket.id });

    registerTaskHandlers(io, socket);
    registerActivityHandlers(io, socket);
    registerPresenceHandlers(io, socket);

    socket.on('conflict:resolve', (data: { taskId: string; resolution: unknown }) => {
      socket.broadcast.emit('conflict:resolved', data);
      logger.info('Conflict resolved', { taskId: data.taskId });
    });
  });

  return io;
}

export default initializeSocket;
