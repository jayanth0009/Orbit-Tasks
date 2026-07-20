import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { Task } from '../models/Task';

const router = Router();

router.use(requireAuth);

router.get('/', async (req: AuthRequest, res) => {
  const tasks = await Task.find({ userId: req.userId });
  const sorted = tasks.sort((a, b) => getTaskScore(b) - getTaskScore(a));
  res.json(sorted);
});

router.post('/', async (req: AuthRequest, res) => {
  const task = await Task.create({ ...req.body, userId: req.userId });
  res.status(201).json(task);
});

router.patch('/:id/toggle', async (req: AuthRequest, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

router.delete('/:id', async (req: AuthRequest, res) => {
  await Task.deleteOne({ _id: req.params.id, userId: req.userId });
  res.status(204).send();
});

const priorityWeight = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4
};

const getTaskScore = (task: { priority: keyof typeof priorityWeight; deadline: Date; completed: boolean }) => {
  if (task.completed) {
    return -1;
  }

  const hoursUntilDeadline = (new Date(task.deadline).getTime() - Date.now()) / 36e5;
  const urgency = Math.max(0, 72 - hoursUntilDeadline);
  return priorityWeight[task.priority] * 100 + urgency;
};

export default router;

