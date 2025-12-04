'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeDemoUsers } from './init-demo';

export type UserRole = 'consumer' | 'admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  storeId?: string;
  storeName?: string;
  createdAt: string;
  blocked?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize demo users on first load
    initializeDemoUsers();

    // Check if user is already logged in (from localStorage or session)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In production, this would call an API endpoint
    // For demo, we simulate auth with localStorage
    const mockUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    
    const foundUser = Object.values(mockUsers).find(
      (u: any) => u.email === email && u.password === password && !u.blocked
    );

    if (!foundUser) {
      throw new Error('Invalid credentials or account blocked');
    }

    const { password: _, ...userWithoutPassword } = foundUser as any;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    const mockUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
    
    if (mockUsers[email]) {
      throw new Error('User already exists');
    }

    const newUser: User & { password: string } = {
      id: `user_${Date.now()}`,
      email,
      password,
      name,
      role,
      createdAt: new Date().toISOString(),
    };

    mockUsers[email] = newUser;
    localStorage.setItem('allUsers', JSON.stringify(mockUsers));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
