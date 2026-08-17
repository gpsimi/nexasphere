'use client';

import React, { useState } from 'react';
import { useAuth } from '@nexasphere/auth';
import { 
  Card, CardHeader, CardTitle, CardDescription, 
  CardContent, Badge, Button, Modal, Table, TableHeader,
  TableBody, TableRow, TableCell, TableHeadCell 
} from '@nexasphere/ui';
import { 
  TrendingUp, ShoppingBag, Users, DollarSign, 
  Package, ShieldCheck, ArrowUpRight, ArrowDownRight, 
  Plus, FileText, CheckCircle2, AlertCircle, Clock,
  Calendar, Download, RefreshCw, BarChart2
} from 'lucide-react';
import { EventBus } from '@nexasphere/utils';

export default function App() {
  const { user } = useAuth();
  const [modalType, setModalType] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const stats = [
    { 
      label: 'Total Enterprise Revenue', 
      value: '₦24,850,000', 
      change: '+12.4%', 
      isPositive: true,
      subtext: 'vs previous month', 
      icon: DollarSign, 
      bg: 'bg-emerald-500/10 text-emerald-600 border border-emerald-200/50' 
    },
    { 
      label: 'Total Orders Processed', 
      value: '1,248', 
      change: '+8.1%', 
      isPositive: true,
      subtext: '98.4% fulfillment rate', 
      icon: ShoppingBag, 
      bg: 'bg-blue-500/10 text-blue-600 border border-blue-200/50' 
    },
    { 
      label: 'Active Customers', 
      value: '8,420', 
      change: '+4.3%', 
      isPositive: true,
      subtext: '142 new this week', 
      icon: Users, 
      bg: 'bg-indigo-500/10 text-indigo-600 border border-indigo-200/50' 
    },
    { 
      label: 'Inventory Health Score', 
      value: '82%', 
      change: 'Optimal', 
      isPositive: true,
      subtext: '1 item below reorder level', 
      icon: Package, 
      bg: 'bg-amber-500/10 text-amber-600 border border-amber-200/50' 
    }
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 14.2, height: '45%' },
    { month: 'Feb', revenue: 16.8, height: '54%' },
    { month: 'Mar', revenue: 18.5, height: '60%' },
    { month: 'Apr', revenue: 15.9, height: '51%' },
    { month: 'May', revenue: 21.4, height: '72%' },
    { month: 'Jun', revenue: 19.8, height: '65%' },
    { month: 'Jul', revenue: 22.9, height: '80%' },
    { month: 'Aug', revenue: 24.8, height: '90%', active: true }
  ];

  const activities = [
    { id: 1, text: 'Payment of ₦145,000 confirmed for Invoice #INV-8890', time: '10m ago', type: 'Payment', badge: 'success' },
    { id: 2, text: 'New corporate client "Dangote Group" registered in Operations', time: '45m ago', type: 'Customer', badge: 'primary' },
    { id: 3, text: 'Stock alert: Industrial Copper Wire (8 rolls remaining)', time: '2h ago', type: 'Inventory', badge: 'warning' },
    { id: 4, text: 'New invoice generated for Order #ORD-4491 (₦75,000)', time: '4h ago', type: 'Invoice', badge: 'neutral' },
    { id: 5, text: 'RBAC Security audit completed: All 6 roles verified', time: '6h ago', type: 'Security', badge: 'secondary' }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      EventBus.publish('NOTIFICATION_RECEIVED', {
        message: 'Dashboard metrics refreshed from PostgreSQL database.',
        type: 'Success'
      });
    }, 600);
  };

  return React.createElement(
    'div',
    { className: 'space-y-6 max-w-7xl mx-auto' },
    
    // --- EXECUTIVE GREETING & HEADER BAR ---
    React.createElement(
      'div',
      { className: 'flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-card' },
      React.createElement(
        'div',
        { className: 'space-y-1' },
        React.createElement(
          'div',
          { className: 'flex items-center space-x-2.5' },
          React.createElement('h1', { className: 'text-2xl font-extrabold text-neutral-900 tracking-tight' }, `Good morning, ${user?.name || 'Administrator'}`),
          React.createElement(Badge, { variant: 'primary', className: 'text-[11px]' }, user?.role || 'Admin')
        ),
        React.createElement('p', { className: 'text-xs text-neutral-500' }, "Here is a real-time operational overview across all 8 enterprise micro-frontend domains.")
      ),
      React.createElement(
        'div',
        { className: 'flex items-center space-x-3' },
        React.createElement(
          Button,
          {
            variant: 'outline',
            size: 'sm',
            onClick: handleRefresh,
            loading: isRefreshing,
            icon: RefreshCw
          },
          'Refresh Data'
        ),
        React.createElement(
          Button,
          {
            variant: 'secondary',
            size: 'sm',
            onClick: () => setModalType('quickAction'),
            icon: Plus
          },
          'Quick Action'
        )
      )
    ),

    // --- KPI CARDS GRID ---
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
      stats.map((s, idx) => React.createElement(
        Card,
        { key: idx, className: 'p-5 relative hover:shadow-card-hover transition-all' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between mb-3' },
          React.createElement('span', { className: 'text-xs font-bold text-neutral-500 uppercase tracking-wider' }, s.label),
          React.createElement(
            'div',
            { className: `h-9 w-9 rounded-xl flex items-center justify-center ${s.bg}` },
            React.createElement(s.icon, { className: 'h-5 w-5' })
          )
        ),
        React.createElement('div', { className: 'text-2xl font-extrabold text-neutral-900 tracking-tight' }, s.value),
        React.createElement(
          'div',
          { className: 'flex items-center space-x-1.5 mt-2 text-xs' },
          React.createElement(
            'span',
            { className: `inline-flex items-center font-bold ${s.isPositive ? 'text-emerald-600' : 'text-rose-600'}` },
            s.isPositive ? React.createElement(ArrowUpRight, { className: 'h-3.5 w-3.5 mr-0.5' }) : React.createElement(ArrowDownRight, { className: 'h-3.5 w-3.5 mr-0.5' }),
            s.change
          ),
          React.createElement('span', { className: 'text-neutral-400 font-medium' }, s.subtext)
        )
      ))
    ),

    // --- CHARTS & REAL-TIME ACTIVITY SPLIT ---
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' },
      
      // Revenue Growth Visual Chart (2 cols)
      React.createElement(
        Card,
        { className: 'lg:col-span-2' },
        React.createElement(
          CardHeader,
          null,
          React.createElement(
            'div',
            null,
            React.createElement(CardTitle, null, 'Monthly Revenue Performance'),
            React.createElement(CardDescription, null, 'Aggregate monthly billing volume (₦ Millions)')
          ),
          React.createElement(
            Badge,
            { variant: 'secondary', className: 'text-xs' },
            '2026 Fiscal Year'
          )
        ),
        React.createElement(
          CardContent,
          null,
          // SVG / Bar visualization
          React.createElement(
            'div',
            { className: 'h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-4 border-b border-neutral-100' },
            monthlyRevenue.map((item, idx) => React.createElement(
              'div',
              { key: idx, className: 'flex-1 flex flex-col items-center gap-2 group relative cursor-pointer' },
              React.createElement(
                'div',
                { className: 'opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-neutral-900 text-white text-[10px] font-bold py-1 px-2 rounded shadow-md pointer-events-none whitespace-nowrap z-10' },
                `₦${item.revenue}M`
              ),
              React.createElement(
                'div',
                { 
                  style: { height: item.height },
                  className: `w-full max-w-[36px] rounded-t-lg transition-all duration-300 group-hover:brightness-110 ${
                    item.active 
                      ? 'bg-gradient-to-t from-secondary-600 to-secondary-400 shadow-sm' 
                      : 'bg-slate-200 hover:bg-slate-300'
                  }`
                }
              ),
              React.createElement('span', { className: `text-xs font-semibold ${item.active ? 'text-secondary-600' : 'text-neutral-500'}` }, item.month)
            ))
          ),
          React.createElement(
            'div',
            { className: 'flex items-center justify-between pt-4 text-xs text-neutral-500 font-medium' },
            React.createElement('span', null, 'Target: ₦22.0M/mo'),
            React.createElement('span', { className: 'text-emerald-600 font-bold' }, 'Current: ₦24.85M (+12.9% above quota)')
          )
        )
      ),

      // Real-Time Enterprise Activity Stream (1 col)
      React.createElement(
        Card,
        null,
        React.createElement(
          CardHeader,
          null,
          React.createElement(
            'div',
            null,
            React.createElement(CardTitle, null, 'Live Activity Stream'),
            React.createElement(CardDescription, null, 'Cross-domain event log')
          ),
          React.createElement(Clock, { className: 'h-4 w-4 text-neutral-400' })
        ),
        React.createElement(
          CardContent,
          { className: 'p-0' },
          React.createElement(
            'div',
            { className: 'divide-y divide-neutral-100 max-h-[300px] overflow-y-auto' },
            activities.map(act => React.createElement(
              'div',
              { key: act.id, className: 'p-4 hover:bg-slate-50 transition-colors flex items-start space-x-3' },
              React.createElement(
                'div',
                { className: 'mt-0.5' },
                React.createElement(Badge, { variant: act.badge, className: 'text-[10px] px-2' }, act.type)
              ),
              React.createElement(
                'div',
                { className: 'flex-1 min-w-0' },
                React.createElement('p', { className: 'text-xs text-neutral-800 font-medium leading-snug' }, act.text),
                React.createElement('span', { className: 'text-[10px] text-neutral-400 block mt-1' }, act.time)
              )
            ))
          )
        )
      )
    ),

    // --- QUICK ACTION MODAL ---
    React.createElement(
      Modal,
      {
        isOpen: modalType === 'quickAction',
        onClose: () => setModalType(null),
        title: 'Enterprise Quick Actions',
        description: 'Trigger operations across micro-frontend services',
        footer: React.createElement(
          Button,
          { variant: 'outline', onClick: () => setModalType(null) },
          'Close'
        )
      },
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
        [
          { label: 'Record Transaction', desc: 'Add income or expense to Finance MFE', path: '/finance', icon: DollarSign },
          { label: 'Register New User', desc: 'Create employee account in Users MFE', path: '/users', icon: Users },
          { label: 'Reorder Low Stock', desc: 'Trigger stock requisition in Inventory', path: '/inventory', icon: Package },
          { label: 'Generate Reports', desc: 'Create executive financial report', path: '/reports', icon: FileText }
        ].map((item, idx) => React.createElement(
          'a',
          {
            key: idx,
            href: item.path,
            className: 'p-4 rounded-xl border border-neutral-200 hover:border-secondary-500 hover:bg-secondary-50/40 transition-all flex items-start space-x-3 group'
          },
          React.createElement(
            'div',
            { className: 'p-2 rounded-lg bg-neutral-100 text-neutral-700 group-hover:bg-secondary-500 group-hover:text-white transition-colors' },
            React.createElement(item.icon, { className: 'h-5 w-5' })
          ),
          React.createElement(
            'div',
            null,
            React.createElement('h4', { className: 'text-xs font-bold text-neutral-900' }, item.label),
            React.createElement('p', { className: 'text-[11px] text-neutral-500 mt-0.5' }, item.desc)
          )
        ))
      )
    )
  );
}
