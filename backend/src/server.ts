import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
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

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later.' },
});

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
app.use('/api/tasks', apiLimiter, taskRoutes);
app.use('/api/activities', apiLimiter, activityRoutes);
app.use('/api/users', apiLimiter, userRoutes);
app.use('/api/auth', authLimiter, userRoutes);
app.use('/api/deployments', apiLimiter, deploymentRoutes);

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
