import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences?: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        // Simulate fetching user data
        // TODO: Replace with actual API call
        const userData: User = {
          id: '1',
          email: 'user@example.com',
          name: 'Test User',
          preferences: {
            theme: 'dark',
            notifications: true,
          },
        };

        setState({
          isAuthenticated: true,
          user: userData,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: 'Failed to restore session',
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // TODO: Replace with actual API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (email && password) {
        const userData: User = {
          id: '1',
          email,
          name: email.split('@')[0],
          preferences: {
            theme: 'dark',
            notifications: true,
          },
        };

        localStorage.setItem('authToken', 'dummy-token');
        setState({
          isAuthenticated: true,
          user: userData,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      localStorage.removeItem('authToken');
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Logout failed',
      }));
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...updates } : null,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update user',
      }));
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
