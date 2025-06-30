import { api } from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  bio?: string;
  phone?: string;
  date_of_birth?: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

// Mock user data for testing
const MOCK_USER: User = {
  id: '1',
  username: 'ivan',
  first_name: 'Иван',
  last_name: 'Иванов',
  full_name: 'Иван Иванов',
  email: 'ivan@university.edu',
  role: 'student',
  created_at: new Date().toISOString()
};

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';
  private readonly MOCK_MODE = false; // Set to false to use real backend

  // Get stored token
  getToken(): string | null {
    if (this.MOCK_MODE) {
      return 'mock_token_123';
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get stored refresh token
  getRefreshToken(): string | null {
    if (this.MOCK_MODE) {
      return 'mock_refresh_token_123';
    }
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Get stored user data
  getUser(): User | null {
    if (this.MOCK_MODE) {
      return MOCK_USER;
    }
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (this.MOCK_MODE) {
      return true; // Always authenticated in mock mode
    }
    return !!this.getToken();
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (this.MOCK_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResponse: AuthResponse = {
        user: MOCK_USER,
        tokens: {
          access: 'mock_token_123',
          refresh: 'mock_refresh_token_123'
        }
      };
      
      this.setAuthData(mockResponse);
      return mockResponse;
    }

    try {
      const response = await api.post<AuthResponse>('/auth/login/', credentials);
      this.setAuthData(response.data);
      return response.data;
    } catch (error) {
      throw new Error('Ошибка входа. Проверьте email и пароль.');
    }
  }

  // Register user
  async register(data: RegisterData): Promise<AuthResponse> {
    if (this.MOCK_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '2',
        username: 'ivan',
        first_name: data.firstName,
        last_name: data.lastName,
        full_name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        role: data.role,
        created_at: new Date().toISOString()
      };
      
      const mockResponse: AuthResponse = {
        user: mockUser,
        tokens: {
          access: 'mock_token_123',
          refresh: 'mock_refresh_token_123'
        }
      };
      
      this.setAuthData(mockResponse);
      return mockResponse;
    }

    try {
      // Convert camelCase to snake_case for backend
      const backendData = {
        username: data.email.split('@')[0], // Use email prefix as username
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        password_confirm: data.password, // Backend expects password_confirm
        role: data.role
      };
      
      const response = await api.post<AuthResponse>('/auth/register/', backendData);
      this.setAuthData(response.data);
      return response.data;
    } catch (error) {
      throw new Error('Ошибка регистрации. Попробуйте еще раз.');
    }
  }

  // Logout user
  async logout(): Promise<void> {
    if (this.MOCK_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      this.clearAuthData();
      return;
    }

    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // Refresh access token
  async refreshToken(): Promise<string> {
    if (this.MOCK_MODE) {
      return 'mock_token_123';
    }

    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<{ access: string }>('/auth/refresh/', {
        refresh: refreshToken
      });

      localStorage.setItem(this.TOKEN_KEY, response.data.access);
      return response.data.access;
    } catch (error) {
      this.clearAuthData();
      throw new Error('Failed to refresh token');
    }
  }

  // Update user profile
  async updateProfile(data: ProfileUpdateData): Promise<User> {
    if (this.MOCK_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = { ...MOCK_USER, ...data };
      
      // Update stored user data
      const currentUser = this.getUser();
      if (currentUser) {
        const newUserData = { ...currentUser, ...updatedUser };
        localStorage.setItem(this.USER_KEY, JSON.stringify(newUserData));
      }
      
      return updatedUser;
    }

    try {
      // Convert camelCase to snake_case for backend
      const backendData: any = {};
      if (data.firstName !== undefined) backendData.first_name = data.firstName;
      if (data.lastName !== undefined) backendData.last_name = data.lastName;
      if (data.email !== undefined) backendData.email = data.email;
      
      const response = await api.patch<User>('/users/update_profile/', backendData);
      
      // Update stored user data
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      throw new Error('Ошибка обновления профиля.');
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (this.MOCK_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      return;
    }

    try {
      await api.post('/users/change_password/', {
        current_password: currentPassword,
        new_password: newPassword
      });
    } catch (error) {
      throw new Error('Ошибка смены пароля.');
    }
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    if (this.MOCK_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    try {
      await api.post('/auth/password_reset/', { email });
    } catch (error) {
      throw new Error('Ошибка запроса сброса пароля.');
    }
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    if (this.MOCK_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    try {
      await api.post('/auth/password_reset_confirm/', {
        token,
        new_password: newPassword
      });
    } catch (error) {
      throw new Error('Ошибка сброса пароля.');
    }
  }

  // Private methods
  private setAuthData(authData: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authData.tokens.access);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authData.tokens.refresh);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Clear all authentication data (for testing)
  clearAllAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    console.log('All authentication data cleared');
  }
}

export const authService = new AuthService(); 