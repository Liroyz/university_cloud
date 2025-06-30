import { LibraryMaterial } from '../contracts/LibraryMaterial';
import { apiRequest } from './api';

export function getLibraryMaterials(): Promise<LibraryMaterial[]> {
  return apiRequest<LibraryMaterial[]>('/library');
}

export function getLibraryMaterial(id: string): Promise<LibraryMaterial> {
  return apiRequest<LibraryMaterial>(`/library/${id}`);
} 