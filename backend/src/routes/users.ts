import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { mockLogin } from '../middleware/auth';

const router = Router();

// POST /api/auth/login
router.post('/login', mockLogin);

// GET /api/users
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().sort({ status: 1, name: 1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/online
router.get('/online', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({ status: { $in: ['online', 'away', 'busy'] } }).sort({
      onlineAt: -1,
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

export default router;
