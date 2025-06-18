import { Course } from '../contracts/Course';
import { apiRequest } from './api';

export function getCourses(): Promise<Course[]> {
  return apiRequest<Course[]>('/courses');
}

export function getCourse(id: string): Promise<Course> {
  return apiRequest<Course>(`/courses/${id}`);
} 