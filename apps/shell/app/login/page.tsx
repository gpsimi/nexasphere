'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@nexasphere/auth';
import { Button, Input, Card, CardContent, Alert, Badge } from '@nexasphere/ui';
import { 
  Sparkles, ShieldCheck, Layers, Database, 
  ArrowRight, Lock, Mail, CheckCircle2, UserCheck
} from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('admin@nexasphere.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const quickRoles = [
    { label: 'Administrator', email: 'admin@nexasphere.com', role: 'Admin', desc: 'Full enterprise scope & RBAC' },
    { label: 'Finance Officer', email: 'finance@nexasphere.com', role: 'Finance', desc: 'Transactions & Invoices' },
    { label: 'Operations Lead', email: 'ops@nexasphere.com', role: 'Operations', desc: 'Orders & Customer CRM' },
    { label: 'Inventory Mgr', email: 'stock@nexasphere.com', role: 'Inventory', desc: 'Stock & Warehouse' },
    { label: 'Management', email: 'ceo@nexasphere.com', role: 'Executive', desc: 'Reports & Analytics' },
    { label: 'Platform Admin', email: 'system@nexasphere.com', role: 'Platform', desc: 'Telemetry & Health' }
  ];

  const handleQuickSelect = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password123');
  };

  return React.createElement(
    'div',
    { className: 'min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-900 font-sans' },
    
    // --- LEFT HERO PANEL (DESKTOP) ---
    React.createElement(
      'div',
      { className: 'hidden lg:flex lg:col-span-5 xl:col-span-5 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 p-12 flex-col justify-between relative overflow-hidden border-r border-primary-700/50' },
      
      // Top Brand
      React.createElement(
        'div',
        { className: 'space-y-6 z-10' },
        React.createElement(
          'div',
          { className: 'flex items-center space-x-3' },
          React.createElement(
            'div',
            { className: 'h-11 w-11 rounded-2xl bg-secondary-500 flex items-center justify-center shadow-lg ring-1 ring-white/20' },
            React.createElement(Sparkles, { className: 'h-6 w-6 text-white' })
          ),
          React.createElement(
            'div',
            null,
            React.createElement('h1', { className: 'text-2xl font-extrabold text-white tracking-tight leading-none' }, 'NexaSphere'),
            React.createElement('span', { className: 'text-xs text-primary-200 font-medium tracking-wider uppercase' }, 'Enterprise Console')
          )
        ),
        React.createElement(
          'div',
          { className: 'pt-8' },
          React.createElement('h2', { className: 'text-3xl font-extrabold text-white leading-tight' }, 'Scalable Micro-Frontend Architecture Model'),
          React.createElement('p', { className: 'text-sm text-primary-200/90 mt-3 leading-relaxed' }, 'A research prototype demonstrating fault-isolated Next.js Multi-Zones, autonomous deployment pipelines, and cloud PostgreSQL database synchronization.')
        )
      ),

      // Value Features List
      React.createElement(
        'div',
        { className: 'space-y-4 my-8 z-10' },
        [
          { icon: Layers, title: '9 Next.js Multi-Zones', desc: 'Independently deployable remotes on ports 3000–3008' },
          { icon: ShieldCheck, title: 'Cryptographic RBAC & JWT', desc: '6 fine-grained role scopes with session sync' },
          { icon: Database, title: 'Supabase PostgreSQL Cloud', desc: 'Direct Prisma ORM queries with fault fallback' }
        ].map((item, idx) => React.createElement(
          'div',
          { key: idx, className: 'flex items-start space-x-3.5 p-3.5 rounded-xl bg-primary-800/40 border border-primary-700/50 backdrop-blur-xs' },
          React.createElement(
            'div',
            { className: 'p-2 rounded-lg bg-secondary-500/20 text-secondary-300' },
            React.createElement(item.icon, { className: 'h-5 w-5' })
          ),
          React.createElement(
            'div',
            null,
            React.createElement('h4', { className: 'text-xs font-bold text-white' }, item.title),
            React.createElement('p', { className: 'text-[11px] text-primary-200/80 mt-0.5' }, item.desc)
          )
        ))
      ),

      // Bottom Footer
      React.createElement(
        'div',
        { className: 'pt-6 border-t border-primary-700/60 flex items-center justify-between text-xs text-primary-300/80 z-10' },
        React.createElement('span', null, '© 2026 NexaSphere Research Group'),
        React.createElement(Badge, { variant: 'success', className: 'text-[10px]' }, 'MSc Prototype Verified')
      )
    ),

    // --- RIGHT PORTAL PANEL ---
    React.createElement(
      'div',
      { className: 'lg:col-span-7 xl:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 bg-slate-50 min-h-screen' },
      
      React.createElement(
        'div',
        { className: 'w-full max-w-md space-y-6' },
        
        // Header
        React.createElement(
          'div',
          { className: 'text-center lg:text-left space-y-1' },
          React.createElement('h2', { className: 'text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight' }, 'Welcome back'),
          React.createElement('p', { className: 'text-xs sm:text-sm text-neutral-500' }, 'Sign in to access your enterprise micro-frontend console.')
        ),

        // Main Login Card
        React.createElement(
          Card,
          { className: 'shadow-xl border-neutral-200/80 p-6 sm:p-8 bg-white' },
          
          error && React.createElement(Alert, { variant: 'error', className: 'mb-5', title: 'Authentication Error' }, error),

          React.createElement(
            'form',
            { onSubmit: handleSubmit, className: 'space-y-4' },
            
            React.createElement(Input, {
              label: 'Email Address',
              type: 'email',
              icon: Mail,
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: 'name@nexasphere.com',
              required: true
            }),

            React.createElement(Input, {
              label: 'Password',
              type: 'password',
              icon: Lock,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: '••••••••',
              required: true
            }),

            React.createElement(
              Button,
              {
                type: 'submit',
                variant: 'secondary',
                size: 'lg',
                className: 'w-full font-bold shadow-md hover:shadow-lg transition-all',
                loading: loading
              },
              'Sign In to NexaSphere',
              React.createElement(ArrowRight, { className: 'h-4 w-4 ml-1' })
            )
          )
        ),

        // 1-Click Fast Role Selector
        React.createElement(
          'div',
          { className: 'space-y-3' },
          React.createElement(
            'div',
            { className: 'flex items-center justify-between' },
            React.createElement('span', { className: 'text-xs font-bold text-neutral-700 uppercase tracking-wider' }, '1-Click Fast Demo Login'),
            React.createElement('span', { className: 'text-[11px] text-neutral-400' }, 'Select a persona')
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-2 sm:grid-cols-3 gap-2' },
            quickRoles.map(role => React.createElement(
              'button',
              {
                key: role.email,
                type: 'button',
                onClick: () => handleQuickSelect(role.email),
                className: `p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                  email === role.email 
                    ? 'border-secondary-500 bg-secondary-50/80 ring-2 ring-secondary-500/20 shadow-xs' 
                    : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/80'
                }`
              },
              React.createElement(
                'div',
                { className: 'flex items-center justify-between mb-1' },
                React.createElement('span', { className: 'text-xs font-bold text-neutral-900 truncate' }, role.label),
                email === role.email && React.createElement(CheckCircle2, { className: 'h-3.5 w-3.5 text-secondary-600 flex-shrink-0' })
              ),
              React.createElement('span', { className: 'text-[10px] text-neutral-500 block truncate leading-tight' }, role.desc)
            ))
          )
        )
      )
    )
  );
}
