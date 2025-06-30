import { Course } from '../contracts/Course';
import { api } from './api';

export interface CreateCourseData {
  name: string;
  code: string;
  description?: string;
}

export async function getCourses(): Promise<Course[]> {
  const response = await api.get<Course[]>('/courses/');
  return response.data;
}

export async function getCourse(id: number): Promise<Course> {
  const response = await api.get<Course>(`/courses/${id}/`);
  return response.data;
}

export async function createCourse(data: CreateCourseData): Promise<Course> {
  const response = await api.post<Course>('/courses/', data);
  return response.data;
}

export async function updateCourse(id: number, data: Partial<Course>): Promise<Course> {
  const response = await api.put<Course>(`/courses/${id}/`, data);
  return response.data;
}

export async function deleteCourse(id: number): Promise<void> {
  await api.delete(`/courses/${id}/`);
} 