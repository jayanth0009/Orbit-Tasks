import { Schema, Types, model } from 'mongoose';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface TaskDocument {
  userId: Types.ObjectId;
  title: string;
  description: string;
  dateTime: Date;
  deadline: Date;
  priority: Priority;
  category: string;
  completed: boolean;
}

const taskSchema = new Schema<TaskDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    dateTime: { type: Date, required: true },
    deadline: { type: Date, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    category: { type: String, default: 'General' },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Task = model<TaskDocument>('Task', taskSchema);

