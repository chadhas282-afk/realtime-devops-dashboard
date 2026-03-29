import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database';
import { initializeSocket } from './socket';
import { errorHandler, notFound } from './middleware/errorHandler';
import logger from './utils/logger';
import taskRoutes from './routes/tasks';
import activityRoutes from './routes/activities';
import userRoutes from './routes/users';
import deploymentRoutes from './routes/deployments';

const app = express();
const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/deployments', deploymentRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Initialize Socket.io
initializeSocket(server);

const PORT = parseInt(process.env.PORT || '5000', 10);

async function bootstrap(): Promise<void> {
  try {
    await connectDatabase();
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`, { port: PORT, env: process.env.NODE_ENV });
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

bootstrap();

export { app, server };
