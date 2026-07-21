import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Orbit Tasks API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const start = () => {
  app.listen(port, '127.0.0.1', () => {
    console.log(`Orbit Tasks API running on port ${port}`);
  });
};

if (process.env.MONGO_URI === 'memory') {
  console.log('Using in-memory storage for local demo mode.');
  start();
} else {
  mongoose
    .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/orbit_tasks')
    .then(() => {
      start();
    })
    .catch((error) => {
      console.error('MongoDB connection failed', error);
      process.exit(1);
    });
}
