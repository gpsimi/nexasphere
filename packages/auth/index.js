'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, EventBus } from '@nexasphere/utils';

const DEFAULT_USER = {
  id: 'usr_admin_1',
  name: 'Godspower Similoluwa',
  email: 'admin@nexasphere.com',
  role: 'Admin',
  department: 'Executive Leadership'
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(DEFAULT_USER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('nexasphere_user');
        const storedToken = localStorage.getItem('nexasphere_token');

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        } else {
          localStorage.setItem('nexasphere_user', JSON.stringify(DEFAULT_USER));
          localStorage.setItem('nexasphere_token', 'demo_jwt_token_godspower_admin');
        }
      }
    } catch (e) {
      console.warn('LocalStorage not available');
    }

    const unsubscribe = EventBus.subscribe('unauthorized', () => {
      setUser(null);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await apiClient.post('/auth/login', { email, password });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexasphere_token', data.token);
        localStorage.setItem('nexasphere_user', JSON.stringify(data.user));
      }
      
      setUser(data.user);
      EventBus.publish('USER_LOGGED_IN', data.user);
      return data.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nexasphere_token');
      localStorage.removeItem('nexasphere_user');
    }
    setUser(null);
    EventBus.publish('USER_LOGGED_OUT', null);
  };

  const hasPermission = (permission) => {
    if (!user) return true;
    if (user.role === 'Admin') return true;
    
    const rolePermissions = {
      Admin: ['view_dashboard', 'manage_users', 'view_finance', 'view_operations', 'view_inventory', 'view_reports', 'view_analytics', 'view_system_health'],
      Finance: ['view_dashboard', 'view_finance', 'view_reports', 'manage_transactions', 'manage_invoices'],
      Operations: ['view_dashboard', 'view_operations', 'view_inventory', 'manage_customers', 'manage_orders'],
      Inventory: ['view_dashboard', 'view_inventory', 'manage_stock'],
      Management: ['view_dashboard', 'view_reports', 'view_analytics'],
      PlatformAdmin: ['view_dashboard', 'view_system_health', 'manage_modules']
    };
    
    const permissions = rolePermissions[user.role] || [];
    return permissions.includes(permission);
  };

  const value = {
    user: user || DEFAULT_USER,
    loading,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!user,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: DEFAULT_USER,
      loading: false,
      login: async () => DEFAULT_USER,
      logout: () => {},
      hasPermission: () => true,
      isAuthenticated: true
    };
  }
  return context;
};
