import { User } from './User';

export interface FileItem {
  id: string;
  name: string;
  type: string; // e.g. 'pdf', 'docx', 'pptx'
  size: number; // in bytes
  owner: User;
  sharedWith?: User[];
  updatedAt: string; // ISO date string
  createdAt: string; // ISO date string
  url: string;
} 