import { User } from '../contracts/User';
import { apiRequest } from './api';

export function getCurrentUser(): Promise<User> {
  return apiRequest<User>('/users/me');
}

export function updateUser(user: Partial<User>): Promise<User> {
  return apiRequest<User>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(user),
  });
} 