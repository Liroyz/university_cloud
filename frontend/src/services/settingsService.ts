import { Settings } from '../contracts/Settings';
import { apiRequest } from './api';

export function getSettings(): Promise<Settings> {
  return apiRequest<Settings>('/settings');
}

export function updateSettings(settings: Partial<Settings>): Promise<Settings> {
  return apiRequest<Settings>('/settings', {
    method: 'PATCH',
    body: JSON.stringify(settings),
  });
} 