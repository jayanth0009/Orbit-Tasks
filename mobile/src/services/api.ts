import { CreateTaskInput, Task } from '../types/task';

const API_URL = 'http://10.0.2.2:4000/api';

export interface AuthResponse {
  token: string;
  user: { id: string; email: string };
}

const request = async <T>(path: string, options: RequestInit = {}, token?: string): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Something went wrong' }));
    throw new Error(error.message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};

export const api = {
  register: (email: string, password: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  getTasks: (token: string) => request<Task[]>('/tasks', {}, token),
  createTask: (token: string, input: CreateTaskInput) =>
    request<Task>(
      '/tasks',
      {
        method: 'POST',
        body: JSON.stringify(input)
      },
      token
    ),
  toggleTask: (token: string, id: string) => request<Task>(`/tasks/${id}/toggle`, { method: 'PATCH' }, token),
  deleteTask: (token: string, id: string) => request<void>(`/tasks/${id}`, { method: 'DELETE' }, token)
};

