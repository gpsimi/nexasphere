'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@nexasphere/auth';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@nexasphere/ui';
import { 
  TrendingUp, ShoppingCart, Users, CheckCircle, 
  ArrowUpRight, DollarSign, Package, ShieldCheck, AlertCircle
} from 'lucide-react';
import { EventBus } from '@nexasphere/utils';

export default function App() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const stats = [
    { label: 'Total Revenue', value: '₦24.8M', change: '+12.4%', icon: DollarSign, color: 'text-success-500 bg-green-50' },
    { label: 'Total Orders', value: '1,248', change: '+8.1%', icon: ShoppingCart, color: 'text-secondary-500 bg-blue-50' },
    { label: 'Active Customers', value: '8,420', change: '+4.3%', icon: Users, color: 'text-primary-500 bg-primary-50' },
    { label: 'Inventory Health', value: '82%', change: 'Healthy', icon: Package, color: 'text-warning-500 bg-amber-50' }
  ];

  const activities = [
    { id: 1, text: 'Payment of ₦145,000 received for Invoice #INV-8890', time: '10 minutes ago', type: 'Payment' },
    { id: 2, text: 'New customer "Acme Logistics Ltd" registered successfully', time: '45 minutes ago', type: 'Customer' },
    { id: 3, text: 'Product "Premium Steel Pipes" status updated: Low Stock (12 units)', time: '2 hours ago', type: 'Inventory' },
    { id: 4, text: 'New invoice generated for Order #ORD-4491 (Amount: ₦75,000)', time: '4 hours ago', type: 'Invoice' },
    { id: 5, text: 'User account created: Tunde Bakare (Operations Department)', time: '5 hours ago', type: 'User' }
  ];

  const quickActions = [
    { label: 'Record Transaction', event: 'RECORD_TRANSACTION_CLICKED', action: () => alert('Mock transaction panel') },
    { label: 'Add New Product', event: 'ADD_PRODUCT_CLICKED', action: () => alert('Mock product panel') },
    { label: 'Generate Reports', event: 'GENERATE_REPORTS_CLICKED', action: () => alert('Mock reports generation') }
  ];

  return React.createElement(
    'div',
    { className: 'space-y-6' },
    
    // Greeting Area
    React.createElement(
      'div',
      { className: 'flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0' },
      React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-bold text-neutral-900' }, `Good morning, ${user?.name || 'User'}`),
        React.createElement('p', { className: 'text-xs text-neutral-500 mt-1' }, "Here's what's happening across your organisation today.")
      ),
      React.createElement(
        Badge,
        { variant: 'success', className: 'flex items-center px-3 py-1 bg-green-50 text-green-700 font-semibold' },
        React.createElement(ShieldCheck, { className: 'h-4 w-4 mr-1' }),
        'RBAC: Secure Client Environment'
      )
    ),

    // KPI Cards Grid
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
      stats.map(s => React.createElement(
        Card,
        { key: s.label, className: 'flex flex-col p-4 relative' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between mb-2' },
          React.createElement('span', { className: 'text-xs font-semibold text-neutral-500' }, s.label),
          React.createElement(
            'div',
            { className: `h-8 w-8 rounded flex items-center justify-center ${s.color}` },
            React.createElement(s.icon, { className: 'h-4 w-4' })
          )
        ),
        React.createElement('span', { className: 'text-2xl font-bold text-neutral-900 mb-1' }, s.value),
        React.createElement(
          'div',
          { className: 'flex items-center' },
          React.createElement(
            Badge,
            { variant: s.label === 'Inventory Health' ? 'warning' : 'success', className: 'text-[10px] px-1 py-0.5' },
            s.change
          ),
          React.createElement('span', { className: 'text-[10px] text-neutral-400 ml-1.5' }, 'vs last month')
        )
      ))
    ),

    // Dashboard visual charts & activities split layout
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' },
      
      // Revenue Trend chart visualization (using clean SVG layouts as described in rules)
      React.createElement(
        Card,
        { className: 'lg:col-span-2' },
        React.createElement(
          CardHeader,
          { className: 'flex justify-between items-center' },
          React.createElement(CardTitle, null, 'Monthly Revenue Trend'),
          React.createElement(
            Badge,
            { variant: 'primary', className: 'text-xxs' },
            '₦ Millions'
          )
        ),
        React.createElement(
          CardContent,
          { className: 'p-6 flex flex-col items-center justify-center' },
          // Simple SVG Line Chart representation
          React.createElement(
            'svg',
            { viewBox: '0 0 500 200', className: 'w-full h-48 text-primary-500' },
            React.createElement('path', {
              d: 'M 10,180 L 80,140 L 150,150 L 220,90 L 290,110 L 360,60 L 430,40 L 490,20',
              fill: 'none',
              stroke: '#2563eb',
              strokeWidth: '3'
            }),
            // Fill area
            React.createElement('path', {
              d: 'M 10,180 L 80,140 L 150,150 L 220,90 L 290,110 L 360,60 L 430,40 L 490,20 L 490,190 L 10,190 Z',
              fill: '#2563eb',
              fillOpacity: '0.1'
            }),
            // Dot indicators
            [
              { x: 10, y: 180, label: 'Jan' },
              { x: 80, y: 140, label: 'Feb' },
              { x: 150, y: 150, label: 'Mar' },
              { x: 220, y: 90, label: 'Apr' },
              { x: 290, y: 110, label: 'May' },
              { x: 360, y: 60, label: 'Jun' },
              { x: 430, y: 40, label: 'Jul' },
              { x: 490, y: 20, label: 'Aug' }
            ].map(dot => React.createElement(
              'g',
              { key: dot.label },
              React.createElement('circle', { cx: dot.x, cy: dot.y, r: '4', fill: '#1b365d' }),
              React.createElement('text', { x: dot.x - 10, y: 195, fontSize: '8', fill: '#6b7280' }, dot.label)
            ))
          )
        )
      ),

      // Recent Activity list card
      React.createElement(
        Card,
        null,
        React.createElement(
          CardHeader,
          null,
          React.createElement(CardTitle, null, 'Recent Activity')
        ),
        React.createElement(
          CardContent,
          { className: 'p-0' },
          React.createElement(
            'ul',
            { className: 'divide-y divide-neutral-100' },
            activities.map(a => React.createElement(
              'li',
              { key: a.id, className: 'p-3 hover:bg-neutral-50/50 transition-colors flex flex-col space-y-1' },
              React.createElement('p', { className: 'text-xs text-neutral-700 font-medium' }, a.text),
              React.createElement(
                'div',
                { className: 'flex justify-between items-center' },
                React.createElement('span', { className: 'text-[10px] text-neutral-400' }, a.time),
                React.createElement(
                  Badge,
                  { variant: 'neutral', className: 'text-[9px] px-1 py-0' },
                  a.type
                )
              )
            ))
          )
        )
      )
    ),

    // Quick Actions Panel
    React.createElement(
      Card,
      null,
      React.createElement(
        CardHeader,
        null,
        React.createElement(CardTitle, null, 'Quick Operations')
      ),
      React.createElement(
        CardContent,
        { className: 'flex flex-wrap gap-3' },
        quickActions.map(act => React.createElement(
          Button,
          { 
            key: act.label, 
            variant: 'outline', 
            size: 'sm', 
            onClick: () => {
              // Emit event over global EventBus for other remotes/shell to respond to
              EventBus.publish('NOTIFICATION_RECEIVED', {
                message: `Action Triggered: ${act.label}`,
                type: 'Information'
              });
              act.action();
            }
          },
          act.label,
          React.createElement(ArrowUpRight, { className: 'ml-1.5 h-3.5 w-3.5' })
        ))
      )
    )
  );
}
