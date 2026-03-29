import { Router, Request, Response, NextFunction } from 'express';
import { Activity } from '../models/Activity';

const router = Router();

// GET /api/activities
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit) || '50', 10), 100);
    const type = req.query.type as string | undefined;

    const filter: Record<string, unknown> = {};
    if (type) filter.type = type;

    const activities = await Activity.find(filter).sort({ timestamp: -1 }).limit(limit);
    res.json(activities);
  } catch (error) {
    next(error);
  }
});

export default router;
