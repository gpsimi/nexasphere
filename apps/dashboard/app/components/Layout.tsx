'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@nexasphere/auth';
import { EventBus } from '@nexasphere/utils';
import { 
  LayoutDashboard, Users, CreditCard, ShoppingBag, 
  Package, FileText, Bell, Activity, BarChart3, 
  LogOut, Menu, X, Shield, Sparkles, CheckCircle2, 
  AlertTriangle, Info, XCircle, Search, ChevronRight
} from 'lucide-react';
import { Button, Badge, StatusDot, Avatar } from '@nexasphere/ui';

export const Layout = ({ children }) => {
  const { user, logout, hasPermission } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = EventBus.subscribe('NOTIFICATION_RECEIVED', (notif) => {
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
    router.push('/login');
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
  const breadcrumbs = getBreadcrumbs();

  return React.createElement(
    'div',
    { className: 'flex h-screen bg-slate-50 overflow-hidden font-sans text-neutral-900' },
    
    // --- SIDEBAR (DESKTOP) ---
    React.createElement(
      'aside',
      { className: 'hidden md:flex md:flex-shrink-0 flex-col w-64 bg-primary-700 text-white border-r border-primary-800 shadow-xl' },
      
      // Brand Logo Header
      React.createElement(
        'div',
        { className: 'flex items-center justify-between h-16 px-5 border-b border-primary-600/60 bg-primary-800/40' },
        React.createElement(
          'div',
          { className: 'flex items-center space-x-3' },
          React.createElement(
            'div',
            { className: 'h-9 w-9 rounded-xl bg-gradient-to-tr from-secondary-600 to-secondary-400 flex items-center justify-center shadow-md ring-1 ring-white/20' },
            React.createElement(Sparkles, { className: 'h-5 w-5 text-white' })
          ),
          React.createElement(
            'div',
            null,
            React.createElement('span', { className: 'text-base font-extrabold tracking-tight text-white block leading-tight' }, 'NexaSphere'),
            React.createElement('span', { className: 'text-[10px] text-primary-200 font-medium tracking-wider uppercase' }, 'Enterprise v1.0')
          )
        )
      ),

      // Navigation Items
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
                Link,
                {
                  key: item.to,
                  href: item.to,
                  className: `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 group ${
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
            React.createElement(Avatar, { name: user?.name || 'Godspower Admin', size: 'sm' }),
            React.createElement(
              'div',
              { className: 'min-w-0 flex-1' },
              React.createElement('p', { className: 'text-xs font-bold text-white truncate leading-tight' }, user?.name || 'Administrator'),
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
      
      // Top Global Header
      React.createElement(
        'header',
        { className: 'h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between flex-shrink-0 shadow-xs z-20' },
        
        // Left: Mobile Toggle & Breadcrumbs
        React.createElement(
          'div',
          { className: 'flex items-center space-x-4' },
          React.createElement(
            'button',
            {
              onClick: () => setSidebarOpen(!sidebarOpen),
              className: 'md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100'
            },
            React.createElement(Menu, { className: 'h-5 w-5' })
          ),
          React.createElement(
            'div',
            { className: 'flex items-center space-x-2 text-xs text-neutral-500 font-medium' },
            React.createElement('span', { className: 'text-neutral-400' }, 'NexaSphere'),
            breadcrumbs.map((crumb, idx) => React.createElement(
              React.Fragment,
              { key: idx },
              React.createElement(ChevronRight, { className: 'h-3.5 w-3.5 text-neutral-300' }),
              React.createElement('span', { className: idx === breadcrumbs.length - 1 ? 'text-neutral-900 font-bold' : 'text-neutral-600' }, crumb)
            ))
          )
        ),

        // Right: Status Badge & Notification Center
        React.createElement(
          'div',
          { className: 'flex items-center space-x-4' },
          
          // Cluster Status Pill
          React.createElement(
            'div',
            { className: 'hidden sm:flex items-center space-x-2 px-3 py-1 bg-success-50 border border-success-200/60 rounded-full text-xs font-semibold text-success-700' },
            React.createElement(StatusDot, { status: 'online' }),
            React.createElement('span', null, 'Cluster Healthy • 8 MFEs Active')
          ),

          // Notification Bell
          React.createElement(
            'div',
            { className: 'relative' },
            React.createElement(
              'button',
              {
                onClick: () => setShowNotifications(!showNotifications),
                className: 'relative p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer'
              },
              React.createElement(Bell, { className: 'h-5 w-5' }),
              unreadCount > 0 && React.createElement(
                'span',
                { className: 'absolute top-1.5 right-1.5 h-4 w-4 bg-secondary-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse' },
                unreadCount
              )
            ),

            // Notifications Dropdown Menu
            showNotifications && React.createElement(
              'div',
              { className: 'absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-neutral-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150' },
              React.createElement(
                'div',
                { className: 'px-4 py-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50' },
                React.createElement('h4', { className: 'text-xs font-bold text-neutral-900 uppercase tracking-wider' }, 'Notifications'),
                React.createElement(
                  'button',
                  {
                    onClick: () => setNotifications(prev => prev.map(n => ({ ...n, read: true }))),
                    className: 'text-xs font-medium text-secondary-600 hover:text-secondary-700 cursor-pointer'
                  },
                  'Mark all read'
                )
              ),
              React.createElement(
                'div',
                { className: 'max-h-72 overflow-y-auto divide-y divide-neutral-100' },
                notifications.length === 0 ? React.createElement(
                  'div',
                  { className: 'p-6 text-center text-xs text-neutral-500' },
                  'No notifications'
                ) : notifications.map(n => React.createElement(
                  'div',
                  { key: n.id, className: `p-3.5 flex items-start space-x-3 transition-colors ${n.read ? 'bg-white' : 'bg-secondary-50/40'}` },
                  React.createElement(
                    'div',
                    { className: 'mt-0.5' },
                    n.type === 'Success' 
                      ? React.createElement(CheckCircle2, { className: 'h-4 w-4 text-success-500' })
                      : n.type === 'Warning'
                      ? React.createElement(AlertTriangle, { className: 'h-4 w-4 text-warning-500' })
                      : React.createElement(Info, { className: 'h-4 w-4 text-secondary-500' })
                  ),
                  React.createElement(
                    'div',
                    { className: 'flex-1 min-w-0' },
                    React.createElement('p', { className: 'text-xs text-neutral-900 font-medium leading-snug' }, n.message),
                    React.createElement('span', { className: 'text-[10px] text-neutral-400 mt-1 block' }, n.time)
                  )
                ))
              )
            )
          )
        )
      ),

      // Page Content Viewport
      React.createElement(
        'main',
        { className: 'flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50' },
        children
      )
    )
  );
};
