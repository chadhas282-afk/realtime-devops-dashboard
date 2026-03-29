import { Router, Request, Response, NextFunction } from 'express';
import { Deployment } from '../models/Deployment';
import { Activity } from '../models/Activity';

const router = Router();

// GET /api/deployments
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const deployments = await Deployment.find().sort({ timestamp: -1 }).limit(20);
    res.json(deployments);
  } catch (error) {
    next(error);
  }
});

// POST /api/deployments
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deployment = new Deployment(req.body);
    await deployment.save();

    await Activity.create({
      type: 'deployment_started',
      userId: req.user?.id,
      description: `Deployment "${deployment.name}" started in ${deployment.environment}`,
    });

    res.status(201).json(deployment);
  } catch (error) {
    next(error);
  }
});

// PUT /api/deployments/:id
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deployment = await Deployment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!deployment) {
      res.status(404).json({ error: 'Deployment not found' });
      return;
    }

    const activityType =
      deployment.status === 'success'
        ? 'deployment_completed'
        : deployment.status === 'failed'
          ? 'deployment_failed'
          : 'deployment_started';

    await Activity.create({
      type: activityType,
      userId: req.user?.id,
      description: `Deployment "${deployment.name}" ${deployment.status}`,
    });

    res.json(deployment);
  } catch (error) {
    next(error);
  }
});

export default router;
