import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { randomUUID } from 'crypto';
import { User } from '../models/User';
import { signToken } from '../utils/token';

const router = Router();

interface MemoryUser {
  _id: string;
  email: string;
  passwordHash: string;
}

const memoryUsers: MemoryUser[] = [];

router.post('/register', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Enter a valid email and a password with at least 6 characters.' });
  }

  if (process.env.MONGO_URI === 'memory') {
    const existing = memoryUsers.find((user) => user.email === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = {
      _id: randomUUID(),
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12)
    };
    memoryUsers.push(user);

    return res.status(201).json({
      token: signToken(user._id),
      user: { id: user._id, email: user.email }
    });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash });

  res.status(201).json({
    token: signToken(user._id.toString()),
    user: { id: user._id, email: user.email }
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (process.env.MONGO_URI === 'memory') {
    const user = memoryUsers.find((item) => item.email === email?.toLowerCase());
    if (!user || !password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.json({
      token: signToken(user._id),
      user: { id: user._id, email: user.email }
    });
  }

  const user = await User.findOne({ email });

  if (!user || !password) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  res.json({
    token: signToken(user._id.toString()),
    user: { id: user._id, email: user.email }
  });
});

export default router;
