import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from './styles/theme';
import Navbar from './components/Navbar';
import MyFiles from './pages/MyFiles';
import SharedFiles from './pages/SharedFiles';
import Courses from './pages/Courses';
import Assignments from './pages/Assignments';
import Library from './pages/Library';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import { authService, User } from './services/authService';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.background.default};
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

// Authentication Context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <AppContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: theme.typography.h4.fontSize,
          color: theme.colors.text.secondary
        }}>
          <i className="fas fa-spinner fa-spin" style={{ marginRight: theme.spacing.sm }}></i>
          Загрузка...
        </div>
      </AppContainer>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Auth Provider Component
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = () => {
      const currentUser = authService.getUser();
      if (currentUser && authService.isAuthenticated()) {
        setUser(currentUser);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user data even if logout fails
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContainer>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <MainContent>
                    <Navigate to="/my-files" replace />
                  </MainContent>
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/my-files" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <MainContent>
                    <MyFiles />
                  </MainContent>
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/shared" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <MainContent>
                    <SharedFiles />
                  </MainContent>
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/courses" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <MainContent>
                    <Courses />
                  </MainContent>
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/assignments" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <MainContent>
                    <Assignments />
                  </MainContent>
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/library" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <MainContent>
                    <Library />
                  </MainContent>
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <MainContent>
                    <Settings />
                  </MainContent>
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <MainContent>
                    <Profile />
                  </MainContent>
                </>
              </ProtectedRoute>
            } />
          </Routes>
        </AppContainer>
      </Router>
    </AuthProvider>
  );
}

export default App;
