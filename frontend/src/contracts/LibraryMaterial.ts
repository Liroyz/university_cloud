import { FileItem } from './File';

export interface LibraryMaterial {
  id: string;
  title: string;
  author: string;
  type: 'book' | 'article' | 'video' | 'presentation' | 'document';
  file: FileItem;
  addedAt: string;
} 