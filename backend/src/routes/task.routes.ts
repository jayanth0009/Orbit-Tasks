import { Router } from 'express';
import { randomUUID } from 'crypto';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { Task } from '../models/Task';
import { Priority } from '../models/Task';

const router = Router();

router.use(requireAuth);

interface MemoryTask {
  _id: string;
  userId: string;
  title: string;
  description: string;
  dateTime: Date;
  deadline: Date;
  priority: Priority;
  category: string;
  completed: boolean;
}

const memoryTasks: MemoryTask[] = [];

router.get('/', async (req: AuthRequest, res) => {
  if (process.env.MONGO_URI === 'memory') {
    const tasks = memoryTasks.filter((task) => task.userId === req.userId);
    return res.json(tasks.sort((a, b) => getTaskScore(b) - getTaskScore(a)));
  }

  const tasks = await Task.find({ userId: req.userId });
  const sorted = tasks.sort((a, b) => getTaskScore(b) - getTaskScore(a));
  res.json(sorted);
});

router.post('/', async (req: AuthRequest, res) => {
  if (process.env.MONGO_URI === 'memory') {
    const task: MemoryTask = {
      _id: randomUUID(),
      userId: req.userId || '',
      title: req.body.title,
      description: req.body.description || '',
      dateTime: new Date(req.body.dateTime),
      deadline: new Date(req.body.deadline),
      priority: req.body.priority || 'medium',
      category: req.body.category || 'General',
      completed: false
    };
    memoryTasks.push(task);
    return res.status(201).json(task);
  }

  const task = await Task.create({ ...req.body, userId: req.userId });
  res.status(201).json(task);
});

router.patch('/:id/toggle', async (req: AuthRequest, res) => {
  if (process.env.MONGO_URI === 'memory') {
    const task = memoryTasks.find((item) => item._id === req.params.id && item.userId === req.userId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = !task.completed;
    return res.json(task);
  }

  const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

router.delete('/:id', async (req: AuthRequest, res) => {
  if (process.env.MONGO_URI === 'memory') {
    const index = memoryTasks.findIndex((item) => item._id === req.params.id && item.userId === req.userId);
    if (index >= 0) {
      memoryTasks.splice(index, 1);
    }
    return res.status(204).send();
  }

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
