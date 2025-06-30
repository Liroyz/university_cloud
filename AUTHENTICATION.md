# Authentication System

This document describes the authentication system implemented for the University Cloud React application.

## Overview

The authentication system provides a complete user authentication and authorization flow with the following features:

- User registration and login
- Password reset functionality
- Protected routes
- User profile management
- Token-based authentication with refresh tokens

## Components

### Pages

1. **Login** (`/login`)
   - Email and password authentication
   - Forgot password link
   - Link to registration

2. **Register** (`/register`)
   - User registration with role selection (Student/Teacher)
   - Form validation
   - Terms and conditions acceptance

3. **ForgotPassword** (`/forgot-password`)
   - Password reset request
   - Email validation
   - Success/error messaging

4. **Profile** (`/profile`)
   - View and edit user information
   - Avatar management
   - Security settings

### Services

1. **AuthService** (`src/services/authService.ts`)
   - Handles all authentication operations
   - Token management (access and refresh tokens)
   - User data persistence
   - API communication

2. **API Service** (`src/services/api.ts`)
   - Axios-based HTTP client
   - Automatic token injection
   - Token refresh handling
   - Error handling

### Context

**AuthContext** (`src/App.tsx`)
- Provides authentication state throughout the app
- User information and authentication status
- Login, register, and logout functions
- Loading states

## Features

### Authentication Flow

1. **Registration**
   - User fills out registration form
   - Form validation (required fields, email format, password strength)
   - Role selection (Student/Teacher)
   - Terms acceptance
   - API call to register user
   - Automatic login after successful registration

2. **Login**
   - Email and password authentication
   - Form validation
   - API call to authenticate user
   - Token storage in localStorage
   - Redirect to main application

3. **Protected Routes**
   - All main application routes are protected
   - Unauthenticated users are redirected to login
   - Loading states during authentication check

4. **Token Management**
   - Access tokens for API requests
   - Refresh tokens for token renewal
   - Automatic token refresh on 401 errors
   - Secure token storage in localStorage

5. **Logout**
   - Clear all stored tokens and user data
   - API call to invalidate refresh token
   - Redirect to login page

### User Interface

- **Consistent Design**: All authentication pages follow the project's design system
- **Responsive Layout**: Works on desktop and mobile devices
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time validation with clear error messages
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Security Features

- **Password Requirements**: Minimum 6 characters
- **Email Validation**: Proper email format validation
- **Token Security**: Secure token storage and automatic refresh
- **CSRF Protection**: Token-based API requests
- **Input Sanitization**: Form validation and sanitization

## Usage

### For Developers

1. **Using Authentication Context**
   ```typescript
   import { useAuth } from '../App';
   
   const { user, isAuthenticated, login, logout } = useAuth();
   ```

2. **Protected Components**
   ```typescript
   // Components are automatically protected by the AuthProvider
   // No additional code needed for route protection
   ```

3. **API Calls**
   ```typescript
   import { api } from '../services/api';
   
   // Tokens are automatically included in requests
   const response = await api.get('/user/profile');
   ```

### For Users

1. **Registration**
   - Navigate to `/register`
   - Fill out the form with personal information
   - Select role (Student or Teacher)
   - Accept terms and conditions
   - Click "Зарегистрироваться"

2. **Login**
   - Navigate to `/login`
   - Enter email and password
   - Click "Войти"

3. **Password Reset**
   - Click "Забыли пароль?" on login page
   - Enter email address
   - Check email for reset instructions

4. **Profile Management**
   - Click user avatar in navbar
   - Select "Профиль"
   - Edit personal information
   - Update security settings

## Configuration

### Environment Variables

```env
REACT_APP_API_URL=http://localhost:4000/api
```

### API Endpoints

The authentication system expects the following API endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Token refresh
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset
- `PUT /auth/profile` - Update user profile
- `PUT /auth/change-password` - Change password

## Styling

All authentication components use the project's design system:

- **Theme**: Consistent colors, typography, and spacing
- **Components**: Reusable Button, Input, and Card components
- **Responsive**: Mobile-first design approach
- **Accessibility**: High contrast and proper focus states

## Future Enhancements

- Two-factor authentication (2FA)
- Email verification
- Account deletion
- Session management
- Role-based access control (RBAC)
- Audit logging
- Multi-language support 