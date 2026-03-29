import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; name: string };
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Invalid JWT token', { error });
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function generateToken(payload: { id: string; email: string; name: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function mockLogin(req: Request, res: Response): void {
  const { email, password } = req.body as { email: string; password: string };

  const mockUsers = [
    { id: 'user_1', email: 'alice@demo.com', name: 'Alice Johnson', password: 'demo' },
    { id: 'user_2', email: 'bob@demo.com', name: 'Bob Smith', password: 'demo' },
    { id: 'user_3', email: 'carol@demo.com', name: 'Carol Williams', password: 'demo' },
  ];

  const user = mockUsers.find((u) => u.email === email && u.password === password);

  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = generateToken({ id: user.id, email: user.email, name: user.name });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
}
