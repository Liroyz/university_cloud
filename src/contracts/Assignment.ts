import { FileItem } from './File';

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  dueDate: string; // ISO date string
  status: 'pending' | 'completed' | 'overdue' | 'upcoming';
  description?: string;
  files?: FileItem[];
} 