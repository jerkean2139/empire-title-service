import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  displayName: string;
  email: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulated authentication for development
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      // Set a mock user
      setCurrentUser({
        id: '1',
        displayName: 'Demo User',
        email: 'demo@example.com',
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  async function login(email: string, password: string) {
    // Simulate login
    setCurrentUser({
      id: '1',
      displayName: 'Demo User',
      email: email,
    });
  }

  async function logout() {
    // Simulate logout
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
