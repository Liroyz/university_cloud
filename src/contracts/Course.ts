import { User } from './User';

export interface Course {
  id: string;
  title: string;
  teacher: User;
  progress: number; // 0-100
  startDate: string;
  endDate?: string;
  description?: string;
} 