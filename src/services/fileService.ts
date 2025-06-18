import { FileItem } from '../contracts/File';
import { apiRequest, API_BASE_URL } from './api';

export function getFiles(): Promise<FileItem[]> {
  return apiRequest<FileItem[]>('/files');
}

export function getFile(id: string): Promise<FileItem> {
  return apiRequest<FileItem>(`/files/${id}`);
}

export function uploadFile(data: FormData): Promise<FileItem> {
  return fetch(`${API_BASE_URL}/files`, {
    method: 'POST',
    body: data,
  }).then(res => res.json());
}

export function deleteFile(id: string): Promise<void> {
  return apiRequest<void>(`/files/${id}`, { method: 'DELETE' });
} 