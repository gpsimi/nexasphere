'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@nexasphere/auth';
import { EventBus } from '@nexasphere/utils';
import { 
  LayoutDashboard, Users, CreditCard, ShoppingBag, 
  Package, FileText, Bell, Activity, BarChart2, 
  LogOut, Menu, X, ShieldAlert, CheckCircle, Info, XCircle
} from 'lucide-react';
import { Button, Badge } from '@nexasphere/ui';

export const Layout = ({ children }) => {
  const { user, logout, hasPermission } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const unsubscribe = EventBus.subscribe('NOTIFICATION_RECEIVED', (notif) => {
      setNotifications(prev => [
        { id: Date.now().toString(), message: notif.message, type: notif.type || 'Information', read: false },
        ...prev
      ]);
    });
    
    setNotifications([
      { id: '1', message: 'System healthy. All remotes active.', type: 'Success', read: true },
      { id: '2', message: 'Welcome to NexaSphere Enterprise Console.', type: 'Information', read: true }
    ]);

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getPageTitle = () => {
    if (pathname.includes('dashboard')) return 'Enterprise Dashboard';
    if (pathname.includes('users')) return 'User Administration';
    if (pathname.includes('finance')) return 'Financial Management';
    if (pathname.includes('operations')) return 'Operations Console';
    if (pathname.includes('inventory')) return 'Inventory & Stock Control';
    if (pathname.includes('reports')) return 'Consolidated Reports';
    if (pathname.includes('analytics')) return 'Performance Analytics';
    if (pathname.includes('system-health')) return 'System Health Status';
    return 'NexaSphere';
  };

  const navItems = [
    {
      label: 'Overview',
      items: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard' }
      ]
    },
    {
      label: 'Workspace',
      items: [
        { to: '/operations', label: 'Operations', icon: ShoppingBag, permission: 'view_operations' },
        { to: '/inventory', label: 'Inventory', icon: Package, permission: 'view_inventory' }
      ]
    },
    {
      label: 'Finance',
      items: [
        { to: '/finance', label: 'Finance', icon: CreditCard, permission: 'view_finance' }
      ]
    },
    {
      label: 'Management',
      items: [
        { to: '/users', label: 'Users', icon: Users, permission: 'manage_users' },
        { to: '/reports', label: 'Reports', icon: FileText, permission: 'view_reports' }
      ]
    },
    {
      label: 'System',
      items: [
        { to: '/system-health', label: 'System Health', icon: Activity, permission: 'view_system_health' },
        { to: '/analytics', label: 'Analytics', icon: BarChart2, permission: 'view_analytics' }
      ]
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return React.createElement(
    'div',
    { className: 'flex h-screen bg-neutral-50 overflow-hidden' },
    
    // --- SIDEBAR (DESKTOP) ---
    React.createElement(
      'aside',
      { className: 'hidden md:flex md:flex-shrink-0 flex-col w-64 bg-primary-700 text-white border-r border-primary-600' },
      React.createElement(
        'div',
        { className: 'flex items-center h-16 px-6 border-b border-primary-600' },
        React.createElement(Activity, { className: 'h-6 w-6 mr-2 text-secondary-500' }),
        React.createElement('span', { className: 'text-lg font-bold tracking-wider' }, 'NexaSphere')
      ),
      React.createElement(
        'nav',
        { className: 'flex-1 overflow-y-auto px-4 py-4 space-y-6' },
        navItems.map((section, idx) => {
          const visibleItems = section.items.filter(item => hasPermission(item.permission));
          if (visibleItems.length === 0) return null;

          return React.createElement(
            'div',
            { key: idx, className: 'space-y-1' },
            React.createElement('h5', { className: 'px-2 text-xxs font-bold text-primary-200 uppercase tracking-wider mb-2' }, section.label),
            visibleItems.map(item => {
              const active = pathname.startsWith(item.to);
              return React.createElement(
                Link,
                {
                  key: item.to,
                  href: item.to,
                  className: `flex items-center px-3 py-2 text-sm font-medium rounded transition-colors ${
                    active 
                      ? 'bg-primary-600 text-white' 
                      : 'text-primary-100 hover:bg-primary-600/50 hover:text-white'
                  }`
                },
                React.createElement(item.icon, { className: `mr-3 h-5 w-5 ${active ? 'text-white' : 'text-primary-200'}` }),
                item.label
              );
            })
          );
        })
      ),
      React.createElement(
        'div',
        { className: 'p-4 border-t border-primary-600 bg-primary-600/30' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between' },
          React.createElement(
            'div',
            { className: 'flex items-center space-x-2' },
            React.createElement(
              'div',
              { className: 'h-8 w-8 rounded-full bg-secondary-500 flex items-center justify-center font-bold text-white text-xs' },
              user?.name ? user.name[0].toUpperCase() : 'U'
            ),
            React.createElement(
              'div',
              { className: 'truncate' },
              React.createElement('p', { className: 'text-xs font-semibold truncate w-32' }, user?.name || 'User'),
              React.createElement('p', { className: 'text-xxs text-primary-200 truncate w-32' }, user?.role || 'Guest')
            )
          ),
          React.createElement(
            Button,
            { variant: 'ghost', size: 'sm', onClick: handleLogout, className: 'text-primary-200 hover:text-white p-1' },
            React.createElement(LogOut, { className: 'h-4 w-4' })
          )
        )
      )
    ),

    // --- SIDEBAR DRAWER (MOBILE) ---
    sidebarOpen && React.createElement(
      'div',
      { className: 'fixed inset-0 z-40 md:hidden flex' },
      React.createElement('div', { 
        className: 'fixed inset-0 bg-neutral-900/50', 
        onClick: () => setSidebarOpen(false) 
      }),
      React.createElement(
        'div',
        { className: 'relative flex-1 flex flex-col max-w-xs w-full bg-primary-700 text-white' },
        React.createElement(
          'div',
          { className: 'absolute top-0 right-0 -mr-12 pt-2' },
          React.createElement(
            Button,
            { 
              variant: 'ghost', 
              onClick: () => setSidebarOpen(false),
              className: 'ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white text-white' 
            },
            React.createElement(X, { className: 'h-6 w-6' })
          )
        ),
        React.createElement(
          'div',
          { className: 'flex items-center h-16 px-6 border-b border-primary-600' },
          React.createElement(Activity, { className: 'h-6 w-6 mr-2 text-secondary-500' }),
          React.createElement('span', { className: 'text-lg font-bold tracking-wider' }, 'NexaSphere')
        ),
        React.createElement(
          'nav',
          { className: 'flex-1 overflow-y-auto px-4 py-4 space-y-6' },
          navItems.map((section, idx) => {
            const visibleItems = section.items.filter(item => hasPermission(item.permission));
            if (visibleItems.length === 0) return null;

            return React.createElement(
              'div',
              { key: idx, className: 'space-y-1' },
              React.createElement('h5', { className: 'px-2 text-xxs font-bold text-primary-200 uppercase tracking-wider mb-2' }, section.label),
              visibleItems.map(item => {
                const active = pathname.startsWith(item.to);
                return React.createElement(
                  Link,
                  {
                    key: item.to,
                    href: item.to,
                    onClick: () => setSidebarOpen(false),
                    className: `flex items-center px-3 py-2 text-sm font-medium rounded transition-colors ${
                      active 
                        ? 'bg-primary-600 text-white' 
                        : 'text-primary-100 hover:bg-primary-600/50 hover:text-white'
                    }`
                  },
                  React.createElement(item.icon, { className: `mr-3 h-5 w-5 ${active ? 'text-white' : 'text-primary-200'}` }),
                  item.label
                );
              })
            );
          })
        ),
        React.createElement(
          'div',
          { className: 'p-4 border-t border-primary-600 bg-primary-600/30' },
          React.createElement(
            'div',
            { className: 'flex items-center justify-between' },
            React.createElement(
              'div',
              { className: 'flex items-center space-x-2' },
              React.createElement(
                'div',
                { className: 'h-8 w-8 rounded-full bg-secondary-500 flex items-center justify-center font-bold text-white text-xs' },
                user?.name ? user.name[0].toUpperCase() : 'U'
              ),
              React.createElement(
                'div',
                null,
                React.createElement('p', { className: 'text-xs font-semibold truncate w-32' }, user?.name || 'User'),
                React.createElement('p', { className: 'text-xxs text-primary-200 truncate w-32' }, user?.role || 'Guest')
              )
            ),
            React.createElement(
              Button,
              { variant: 'ghost', size: 'sm', onClick: handleLogout, className: 'text-primary-200 hover:text-white p-1' },
              React.createElement(LogOut, { className: 'h-4 w-4' })
            )
          )
        )
      )
    ),

    // --- MAIN HEADER & CONTENT ---
    React.createElement(
      'div',
      { className: 'flex-1 flex flex-col overflow-hidden' },
      
      React.createElement(
        'header',
        { className: 'flex items-center justify-between h-16 bg-white border-b border-neutral-200 px-6' },
        
        React.createElement(
          'div',
          { className: 'flex items-center' },
          React.createElement(
            Button,
            { 
              variant: 'ghost', 
              onClick: () => setSidebarOpen(true),
              className: 'md:hidden p-2 text-neutral-500 hover:text-neutral-900 mr-2' 
            },
            React.createElement(Menu, { className: 'h-6 w-6' })
          ),
          React.createElement('h1', { className: 'text-lg font-bold text-neutral-900' }, getPageTitle())
        ),

        React.createElement(
          'div',
          { className: 'flex items-center space-x-4 relative' },
          
          React.createElement(
            Button,
            { 
              variant: 'ghost', 
              className: 'relative p-2 text-neutral-500 hover:text-neutral-900 rounded-full',
              onClick: () => setShowNotifications(!showNotifications)
            },
            React.createElement(Bell, { className: 'h-5 w-5' }),
            unreadCount > 0 && React.createElement(
              Badge,
              { variant: 'error', className: 'absolute top-0 right-0 px-1 py-0.5 min-w-4 text-xxs font-bold rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1' },
              unreadCount
            )
          ),

          showNotifications && React.createElement(
            'div',
            { className: 'absolute right-0 top-12 z-50 w-80 bg-white border border-neutral-200 rounded shadow-lg overflow-hidden' },
            React.createElement(
              'div',
              { className: 'px-4 py-2 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between' },
              React.createElement('span', { className: 'text-xs font-bold text-neutral-900' }, 'Notifications'),
              unreadCount > 0 && React.createElement(
                Button,
                { 
                  variant: 'ghost', 
                  size: 'sm',
                  className: 'text-xxs text-secondary-500 hover:underline p-0 h-auto',
                  onClick: () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
                },
                'Mark all read'
              )
            ),
            React.createElement(
              'div',
              { className: 'max-h-60 overflow-y-auto divide-y divide-neutral-100' },
              notifications.length === 0 
                ? React.createElement('div', { className: 'p-4 text-center text-xs text-neutral-500' }, 'No notifications.')
                : notifications.map(n => React.createElement(
                    'div',
                    { key: n.id, className: `p-3 flex items-start space-x-2 ${n.read ? 'bg-white' : 'bg-blue-50/20'}` },
                    React.createElement(
                      'div',
                      { className: 'mt-0.5' },
                      n.type === 'Success' && React.createElement(CheckCircle, { className: 'h-4 w-4 text-success-500' }) ||
                      n.type === 'Warning' && React.createElement(ShieldAlert, { className: 'h-4 w-4 text-warning-500' }) ||
                      n.type === 'Error' && React.createElement(XCircle, { className: 'h-4 w-4 text-error-500' }) ||
                      React.createElement(Info, { className: 'h-4 w-4 text-secondary-500' })
                    ),
                    React.createElement(
                      'div',
                      { className: 'flex-1' },
                      React.createElement('p', { className: 'text-xs text-neutral-700' }, n.message),
                      React.createElement('span', { className: 'text-xxs text-neutral-500' }, 'Just now')
                    )
                  ))
            )
          ),

          React.createElement(
            'div',
            { className: 'hidden sm:flex items-center space-x-2 pl-2 border-l border-neutral-200' },
            React.createElement(
              'div',
              { className: 'h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center font-bold text-white text-xs' },
              user?.name ? user.name[0].toUpperCase() : 'U'
            ),
            React.createElement(
              'div',
              { className: 'text-left' },
              React.createElement('p', { className: 'text-xs font-semibold text-neutral-900' }, user?.name || 'User'),
              React.createElement('p', { className: 'text-xxs text-neutral-500' }, user?.role || 'Guest')
            )
          )
        )
      ),

      React.createElement(
        'main',
        { className: 'flex-1 overflow-y-auto p-6 bg-neutral-50' },
        children
      )
    )
  );
};
