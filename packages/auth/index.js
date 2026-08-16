'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, EventBus } from '@nexasphere/utils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('nexasphere_user');
    const storedToken = localStorage.getItem('nexasphere_token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('nexasphere_user');
        localStorage.removeItem('nexasphere_token');
      }
    }
    setLoading(false);

    // Listen to unauthorized events
    const unsubscribe = EventBus.subscribe('unauthorized', () => {
      setUser(null);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await apiClient.post('/auth/login', { email, password });
      
      localStorage.setItem('nexasphere_token', data.token);
      localStorage.setItem('nexasphere_user', JSON.stringify(data.user));
      
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
    localStorage.removeItem('nexasphere_token');
    localStorage.removeItem('nexasphere_user');
    setUser(null);
    EventBus.publish('USER_LOGGED_OUT', null);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    
    // Maps roles to their specific capabilities
    const rolePermissions = {
      Admin: ['view_dashboard', 'manage_users', 'view_finance', 'view_operations', 'view_inventory', 'view_reports', 'view_analytics', 'view_system_health'],
      Finance: ['view_dashboard', 'view_finance', 'view_reports', 'manage_transactions', 'manage_invoices'],
      Operations: ['view_dashboard', 'view_operations', 'view_inventory', 'manage_customers', 'manage_orders'],
      Inventory: ['view_dashboard', 'view_inventory', 'manage_stock'],
      Management: ['view_dashboard', 'view_reports', 'view_analytics'],
      PlatformAdmin: ['view_dashboard', 'view_system_health', 'manage_modules']
    };
    
    if (user.role === 'Admin') return true;
    
    const permissions = rolePermissions[user.role] || [];
    return permissions.includes(permission);
  };

  const value = {
    user,
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
