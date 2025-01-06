export type UserRole = 'superAdmin' | 'admin' | 'manager' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  clientIds?: string[];
  projectIds?: string[];
}

export interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, role: UserRole) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  hasPermission: (requiredRole: UserRole) => boolean;
}
