import { User } from './User';

export interface Course {
  id: number;
  name: string;
  code: string;
  description: string;
  teacher: User;
  created_at: string;
  updated_at: string;
} 