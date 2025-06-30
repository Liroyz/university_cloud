export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  bio?: string;
  phone?: string;
  date_of_birth?: string;
  created_at: string;
} 