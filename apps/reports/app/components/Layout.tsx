'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@nexasphere/auth';
import { EventBus } from '@nexasphere/utils';
import { 
  LayoutDashboard, Users, CreditCard, ShoppingBag, 
  Package, FileText, Bell, Activity, BarChart3, 
  LogOut, Menu, X, Shield, Sparkles, CheckCircle2, 
  AlertTriangle, Info, XCircle, Search, ChevronRight
} from 'lucide-react';
import { Button, Badge, StatusDot, Avatar } from '@nexasphere/ui';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, hasPermission } = useAuth();
  const rawPathname = usePathname();
  const pathname = rawPathname || '';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = EventBus.subscribe('NOTIFICATION_RECEIVED', (notif: any) => {
      setNotifications(prev => [
        { 
          id: Date.now().toString(), 
          message: notif.message || notif.title, 
          type: notif.type || 'Information', 
          time: 'Just now',
          read: false 
        },
        ...prev
      ]);
    });
    
    setNotifications([
      { id: '1', message: 'All 8 Micro-Frontend Remotes connected and operational.', type: 'Success', time: '5m ago', read: false },
      { id: '2', message: 'PostgreSQL database connected (Supabase eu-west-1).', type: 'Success', time: '12m ago', read: true },
      { id: '3', message: 'Welcome to NexaSphere Enterprise Console.', type: 'Information', time: '1h ago', read: true }
    ]);

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const getBreadcrumbs = () => {
    if (pathname.includes('dashboard')) return ['Overview', 'Dashboard'];
    if (pathname.includes('users')) return ['Management', 'Users & Roles'];
    if (pathname.includes('finance')) return ['Finance', 'Transactions & Invoices'];
    if (pathname.includes('operations')) return ['Workspace', 'Customers & Orders'];
    if (pathname.includes('inventory')) return ['Workspace', 'Inventory & Stock'];
    if (pathname.includes('reports')) return ['Management', 'Consolidated Reports'];
    if (pathname.includes('analytics')) return ['System', 'Performance Analytics'];
    if (pathname.includes('system-health')) return ['System', 'Cluster Health Telemetry'];
    return ['Home'];
  };

  const navSections = [
    {
      label: 'OVERVIEW',
      items: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard' }
      ]
    },
    {
      label: 'WORKSPACE',
      items: [
        { to: '/operations', label: 'Operations & Orders', icon: ShoppingBag, permission: 'view_operations' },
        { to: '/inventory', label: 'Inventory & Stock', icon: Package, permission: 'view_inventory' }
      ]
    },
    {
      label: 'FINANCE & BILLING',
      items: [
        { to: '/finance', label: 'Finance Management', icon: CreditCard, permission: 'view_finance' }
      ]
    },
    {
      label: 'MANAGEMENT',
      items: [
        { to: '/users', label: 'User Administration', icon: Users, permission: 'manage_users' },
        { to: '/reports', label: 'Consolidated Reports', icon: FileText, permission: 'view_reports' }
      ]
    },
    {
      label: 'SYSTEM & TELEMETRY',
      items: [
        { to: '/system-health', label: 'System Health', icon: Activity, permission: 'view_system_health' },
        { to: '/analytics', label: 'Performance Analytics', icon: BarChart3, permission: 'view_analytics' }
      ]
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return React.createElement(
    'div',
    { className: 'min-h-screen flex bg-neutral-50 text-neutral-900 font-sans antialiased' },

    // Mobile Backdrop
    sidebarOpen && React.createElement('div', {
      className: 'fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden',
      onClick: () => setSidebarOpen(false)
    }),

    // --- SIDEBAR ---
    React.createElement(
      'aside',
      {
        className: `fixed inset-y-0 left-0 z-50 w-64 bg-primary-900 text-white transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-0 flex flex-col justify-between shadow-xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`
      },
      // Header Brand
      React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'h-16 flex items-center justify-between px-5 border-b border-primary-700/80 bg-primary-950/40' },
          React.createElement(
            'a',
            { href: '/dashboard', className: 'flex items-center space-x-2.5 group cursor-pointer' },
            React.createElement(
              'div',
              { className: 'h-9 w-9 rounded-xl bg-gradient-to-tr from-secondary-500 to-secondary-600 flex items-center justify-center text-white shadow-md shadow-secondary-500/20 group-hover:scale-105 transition-transform' },
              React.createElement(Sparkles, { className: 'h-5 w-5' })
            ),
            React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'text-base font-bold tracking-tight text-white block leading-tight' }, 'NexaSphere'),
              React.createElement('span', { className: 'text-[10px] text-primary-200 font-medium tracking-wider uppercase block' }, 'Enterprise Console')
            )
          ),
          React.createElement(
            'button',
            {
              className: 'md:hidden p-1.5 text-primary-200 hover:text-white rounded-lg transition-colors cursor-pointer',
              onClick: () => setSidebarOpen(false)
            },
            React.createElement(X, { className: 'h-5 w-5' })
          )
        ),

        // Navigation Sections
        React.createElement(
          'nav',
          { className: 'flex-1 overflow-y-auto px-3.5 py-4 space-y-6' },
          navSections.map((section, idx) => {
            const visibleItems = section.items.filter(item => hasPermission(item.permission));
            if (visibleItems.length === 0) return null;

            return React.createElement(
              'div',
              { key: idx, className: 'space-y-1' },
              React.createElement('h5', { className: 'px-3 text-[11px] font-bold text-primary-300/80 uppercase tracking-wider mb-2' }, section.label),
              visibleItems.map(item => {
                const active = pathname.startsWith(item.to);
                return React.createElement(
                  'a',
                  {
                    key: item.to,
                    href: item.to,
                    className: `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 group cursor-pointer ${
                      active 
                        ? 'bg-secondary-500 text-white shadow-sm font-semibold' 
                        : 'text-primary-100/90 hover:bg-primary-600/60 hover:text-white'
                    }`
                  },
                  React.createElement(item.icon, { 
                    className: `mr-3 h-4 w-4 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-primary-200'}` 
                  }),
                  item.label
                );
              })
            );
          })
        )
      ),

      // User Profile Footer
      React.createElement(
        'div',
        { className: 'p-3.5 border-t border-primary-600/60 bg-primary-800/60' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between p-2 rounded-lg bg-primary-700/50 border border-primary-600/40' },
          React.createElement(
            'div',
            { className: 'flex items-center space-x-2.5 min-w-0' },
            React.createElement(Avatar, { name: user?.name || 'Godspower Similoluwa', size: 'sm' }),
            React.createElement(
              'div',
              { className: 'min-w-0 flex-1' },
              React.createElement('p', { className: 'text-xs font-bold text-white truncate leading-tight' }, user?.name || 'Godspower Similoluwa'),
              React.createElement('p', { className: 'text-[10px] text-primary-200 font-medium truncate' }, user?.role || 'Admin')
            )
          ),
          React.createElement(
            'button',
            {
              onClick: handleLogout,
              title: 'Sign Out',
              className: 'p-1.5 text-primary-200 hover:text-white hover:bg-primary-600/80 rounded-md transition-colors cursor-pointer'
            },
            React.createElement(LogOut, { className: 'h-4 w-4' })
          )
        )
      )
    ),

    // --- MAIN CONTENT WRAPPER ---
    React.createElement(
      'div',
      { className: 'flex-1 flex flex-col min-w-0 overflow-hidden' },

      // Global Header
      React.createElement(
        'header',
        { className: 'h-16 bg-white border-b border-neutral-200/80 flex items-center justify-between px-4 sm:px-6 z-10' },
        
        // Left: Hamburger + Breadcrumb
        React.createElement(
          'div',
          { className: 'flex items-center space-x-3' },
          React.createElement(
            'button',
            {
              className: 'md:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer',
              onClick: () => setSidebarOpen(true)
            },
            React.createElement(Menu, { className: 'h-5 w-5' })
          ),
          React.createElement(
            'nav',
            { className: 'hidden sm:flex items-center space-x-1.5 text-xs text-neutral-500' },
            React.createElement('span', { className: 'font-semibold text-neutral-900' }, 'NexaSphere'),
            getBreadcrumbs().map((crumb, i) => (
              React.createElement(React.Fragment, { key: i },
                React.createElement(ChevronRight, { className: 'h-3.5 w-3.5 text-neutral-400' }),
                React.createElement('span', { className: i === getBreadcrumbs().length - 1 ? 'text-secondary-600 font-medium' : 'hover:text-neutral-700' }, crumb)
              )
            ))
          )
        ),

        // Right: Search + System Health Pill + Notification Drawer
        React.createElement(
          'div',
          { className: 'flex items-center space-x-3 sm:space-x-4' },
          
          // System Health Indicator Badge
          React.createElement(
            'a',
            {
              href: '/system-health',
              className: 'hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-success-50 border border-success-200 text-xs font-semibold text-success-700 hover:bg-success-100 transition-colors cursor-pointer'
            },
            React.createElement(StatusDot, { status: 'healthy' }),
            'Cluster Healthy'
          ),

          // Notifications Bell Button
          React.createElement(
            'div',
            { className: 'relative' },
            React.createElement(
              'button',
              {
                className: 'relative p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer',
                onClick: () => setShowNotifications(!showNotifications)
              },
              React.createElement(Bell, { className: 'h-5 w-5' }),
              unreadCount > 0 && React.createElement(
                'span',
                { className: 'absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-secondary-500 ring-2 ring-white' }
              )
            ),

            // Notification Popover Dropdown
            showNotifications && React.createElement(
              'div',
              { className: 'absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-dropdown border border-neutral-200/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150' },
              React.createElement(
                'div',
                { className: 'p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50' },
                React.createElement('h4', { className: 'text-xs font-bold text-neutral-900 uppercase tracking-wider' }, 'Live System Feed'),
                React.createElement(Badge, { variant: 'secondary', size: 'xs' }, `${unreadCount} new`)
              ),
              React.createElement(
                'div',
                { className: 'max-h-72 overflow-y-auto divide-y divide-neutral-100' },
                notifications.length === 0 
                  ? React.createElement('p', { className: 'p-4 text-center text-xs text-neutral-500' }, 'No active notifications')
                  : notifications.map(n => (
                    React.createElement(
                      'div',
                      { key: n.id, className: `p-3.5 hover:bg-neutral-50 transition-colors flex items-start space-x-3 ${!n.read ? 'bg-secondary-50/20' : ''}` },
                      n.type === 'Success' && React.createElement(CheckCircle2, { className: 'h-4 w-4 text-success-500 flex-shrink-0 mt-0.5' }),
                      n.type === 'Information' && React.createElement(Info, { className: 'h-4 w-4 text-secondary-500 flex-shrink-0 mt-0.5' }),
                      n.type === 'Warning' && React.createElement(AlertTriangle, { className: 'h-4 w-4 text-warning-500 flex-shrink-0 mt-0.5' }),
                      n.type === 'Error' && React.createElement(XCircle, { className: 'h-4 w-4 text-error-500 flex-shrink-0 mt-0.5' }),
                      React.createElement(
                        'div',
                        { className: 'flex-1 min-w-0' },
                        React.createElement('p', { className: 'text-xs text-neutral-800 leading-snug font-medium' }, n.message),
                        React.createElement('span', { className: 'text-[10px] text-neutral-400 mt-1 block font-mono' }, n.time)
                      )
                    )
                  ))
              ),
              React.createElement(
                'div',
                { className: 'p-2.5 border-t border-neutral-100 bg-neutral-50 text-center' },
                React.createElement(
                  'button',
                  {
                    className: 'text-[11px] font-semibold text-secondary-600 hover:text-secondary-700 cursor-pointer',
                    onClick: () => {
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                      setShowNotifications(false);
                    }
                  },
                  'Mark all as read'
                )
              )
            )
          )
        )
      ),

      // Main Viewport Container
      React.createElement(
        'main',
        { className: 'flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-neutral-50' },
        children
      )
    )
  );
};
