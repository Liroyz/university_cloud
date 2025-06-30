import { FileItem } from '../contracts/File';
import { api } from './api';

export interface UploadFileData {
  file: File;
  description?: string;
  is_public?: boolean;
  assignment?: number;
  course?: number;
}

export async function getFiles(): Promise<FileItem[]> {
  const response = await api.get<FileItem[]>('/files/');
  return response.data;
}

export async function getMyFiles(): Promise<FileItem[]> {
  const response = await api.get<FileItem[]>('/files/my_files/');
  return response.data;
}

export async function getSharedFiles(): Promise<FileItem[]> {
  const response = await api.get<FileItem[]>('/files/shared_files/');
  return response.data;
}

export async function getFile(id: number): Promise<FileItem> {
  const response = await api.get<FileItem>(`/files/${id}/`);
  return response.data;
}

export async function uploadFile(data: UploadFileData): Promise<FileItem> {
  const formData = new FormData();
  formData.append('file', data.file);
  
  if (data.description) {
    formData.append('description', data.description);
  }
  
  if (data.is_public !== undefined) {
    formData.append('is_public', data.is_public.toString());
  }
  
  if (data.assignment) {
    formData.append('assignment', data.assignment.toString());
  }
  
  if (data.course) {
    formData.append('course', data.course.toString());
  }

  const response = await api.post<FileItem>('/files/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function updateFile(id: number, data: Partial<FileItem>): Promise<FileItem> {
  const response = await api.put<FileItem>(`/files/${id}/`, data);
  return response.data;
}

export async function deleteFile(id: number): Promise<void> {
  await api.delete(`/files/${id}/`);
}

export async function downloadFile(id: number): Promise<{ download_url: string }> {
  const response = await api.get<{ download_url: string }>(`/files/${id}/download/`);
  return response.data;
}

export async function downloadFileDirect(id: number): Promise<void> {
  try {
    // Get the download URL
    const downloadInfo = await downloadFile(id);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = downloadInfo.download_url;
    link.download = ''; // Let the browser determine the filename
    link.target = '_blank'; // Open in new tab/window
    
    // Add authentication headers if needed
    const token = localStorage.getItem('auth_token');
    if (token) {
      // For direct file downloads, we might need to handle authentication differently
      // This is a fallback approach
      link.href = `${downloadInfo.download_url}?token=${token}`;
    }
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error('Failed to download file');
  }
}

export function getFileIcon(fileType: string): string {
  switch (fileType) {
    case 'document':
      return 'fas fa-file-word';
    case 'image':
      return 'fas fa-file-image';
    case 'video':
      return 'fas fa-file-video';
    case 'audio':
      return 'fas fa-file-audio';
    case 'archive':
      return 'fas fa-file-archive';
    default:
      return 'fas fa-file';
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
} 