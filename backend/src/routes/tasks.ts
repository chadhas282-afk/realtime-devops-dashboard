import { Router, Request, Response, NextFunction } from 'express';
import { Task } from '../models/Task';
import { Activity } from '../models/Activity';
import logger from '../utils/logger';

const router = Router();

// GET /api/tasks
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// POST /api/tasks
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = new Task(req.body);
    await task.save();

    await Activity.create({
      type: 'task_created',
      userId: req.user?.id,
      taskId: String(task._id),
      description: `Task "${task.title}" was created`,
    });

    logger.info('Task created', { taskId: task._id, title: task.title });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    await Activity.create({
      type: 'task_updated',
      userId: req.user?.id,
      taskId: String(task._id),
      description: `Task "${task.title}" was updated`,
    });

    logger.info('Task updated', { taskId: task._id });
    res.json(task);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    await Activity.create({
      type: 'task_deleted',
      userId: req.user?.id,
      taskId: req.params.id,
      description: `Task "${task.title}" was deleted`,
    });

    logger.info('Task deleted', { taskId: req.params.id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
