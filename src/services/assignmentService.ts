import { Assignment } from '../contracts/Assignment';
import { apiRequest } from './api';

export function getAssignments(): Promise<Assignment[]> {
  return apiRequest<Assignment[]>('/assignments');
}

export function getAssignment(id: string): Promise<Assignment> {
  return apiRequest<Assignment>(`/assignments/${id}`);
} 