import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StudentUser {
  id: string;
  fullName: string;
  email: string;
  collegeName: string;
  department: string;
  studentId: string;
  role: 'student';
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  organizationName: string;
  role: string;
  department: string;
  contactNumber: string;
  userType: 'admin';
}

type User = StudentUser | AdminUser | null;

interface AuthState {
  user: User;
  userType: 'student' | 'admin' | null;
  isAuthenticated: boolean;
  setUser: (user: User, userType: 'student' | 'admin') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      userType: null,
      isAuthenticated: false,
      setUser: (user, userType) => set({ 
        user, 
        userType, 
        isAuthenticated: user !== null 
      }),
      logout: () => set({ 
        user: null, 
        userType: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'veritas-auth-storage',
    }
  )
);

// Helper to get the initial for avatar
export const getInitial = (name: string | undefined): string => {
  if (!name) return 'U';
  return name.charAt(0).toUpperCase();
};
