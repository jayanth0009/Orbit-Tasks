export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  _id: string;
  title: string;
  description: string;
  dateTime: string;
  deadline: string;
  priority: Priority;
  category: string;
  completed: boolean;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  dateTime: string;
  deadline: string;
  priority: Priority;
  category: string;
}

