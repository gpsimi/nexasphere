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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[AuthProvider] Initializing session authentication...');
    try {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('nexasphere_user');
        const storedToken = localStorage.getItem('nexasphere_token');
        const isLoggedOut = localStorage.getItem('nexasphere_logged_out');

        console.log('[AuthProvider] LocalStorage read:', { storedUser, storedToken, isLoggedOut });

        if (storedUser && storedToken) {
          const parsed = JSON.parse(storedUser);
          console.log('[AuthProvider] Restored active session:', parsed);
          setUser(parsed);
        } else {
          console.log('[AuthProvider] No active session found. Requiring user authentication.');
          setUser(null);
        }
      }
    } catch (e) {
      console.warn('[AuthProvider] LocalStorage not available:', e);
    } finally {
      console.log('[AuthProvider] Setting loading state to false.');
      setLoading(false);
    }

    const unsubscribe = EventBus.subscribe('unauthorized', () => {
      console.log('[AuthProvider] Received unauthorized event, clearing session.');
      setUser(null);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // In demo mode or fallback, simulate server verification
      const data = {
        token: 'demo_jwt_token_' + email.split('@')[0] + '_' + Date.now(),
        user: {
          id: 'usr_' + Date.now(),
          name: email === 'admin@nexasphere.com' ? 'Godspower Similoluwa' : email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          email,
          role: email === 'admin@nexasphere.com' ? 'Admin' :
                email === 'finance@nexasphere.com' ? 'Finance' :
                email === 'ops@nexasphere.com' ? 'Operations' :
                email === 'stock@nexasphere.com' ? 'Inventory' :
                email === 'ceo@nexasphere.com' ? 'Executive' : 'PlatformAdmin',
          department: email === 'admin@nexasphere.com' ? 'Executive Leadership' : 'Enterprise Department'
        }
      };
      
      try {
        const serverRes = await apiClient.post('/auth/login', { email, password });
        if (serverRes.data) {
          data.token = serverRes.data.token;
          data.user = serverRes.data.user;
        }
      } catch (err) {
        // Offline demo mode fallback
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexasphere_token', data.token);
        localStorage.setItem('nexasphere_user', JSON.stringify(data.user));
        localStorage.removeItem('nexasphere_logged_out');
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
      localStorage.setItem('nexasphere_logged_out', 'true');
    }
    setUser(null);
    EventBus.publish('USER_LOGGED_OUT', null);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'Admin') return true;
    
    const rolePermissions = {
      Admin: ['view_dashboard', 'manage_users', 'view_finance', 'view_operations', 'view_inventory', 'view_reports', 'view_analytics', 'view_system_health'],
      Finance: ['view_dashboard', 'view_finance', 'view_reports', 'manage_transactions', 'manage_invoices'],
      Operations: ['view_dashboard', 'view_operations', 'view_inventory', 'manage_customers', 'manage_orders'],
      Inventory: ['view_dashboard', 'view_inventory', 'manage_stock'],
      Executive: ['view_dashboard', 'view_reports', 'view_analytics'],
      Platform: ['view_dashboard', 'view_system_health', 'manage_modules']
    };
    
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
