import { User } from './User';

export interface FileItem {
  id: number;
  file: string; // URL to the file
  original_filename: string;
  file_type: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
  file_size: number; // in bytes
  file_size_display?: string; // human readable size
  mime_type: string;
  uploaded_at: string; // ISO date string
  uploaded_by: User;
  assignment?: number; // assignment ID
  course?: number; // course ID
  is_public: boolean;
  description: string;
  file_url?: string; // full URL for download
} 