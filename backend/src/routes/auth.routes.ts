import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { User } from '../models/User';
import { signToken } from '../utils/token';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Enter a valid email and a password with at least 6 characters.' });
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

