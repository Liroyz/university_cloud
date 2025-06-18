export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'student' | 'teacher';
  avatarUrl?: string;
} 