import mongoose from 'mongoose';
import logger from '../utils/logger';

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/devops_dashboard';

  try {
    await mongoose.connect(uri);
    logger.info('MongoDB connected successfully', { uri: uri.replace(/\/\/.*@/, '//***@') });
  } catch (error) {
    logger.error('MongoDB connection failed', error);
    throw error;
  }

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });
}

export default connectDatabase;
