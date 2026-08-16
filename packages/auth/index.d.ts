import React from 'react';
import { User } from '@nexasphere/types';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: md5) => Promise<User>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isAuthenticated: boolean;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }>;
export const useAuth: () => AuthContextType;
