'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@nexasphere/auth';
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Alert } from '@nexasphere/ui';
import { Activity } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setError(err.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quickProfiles = [
    { label: 'Admin', email: 'admin@nexasphere.com', desc: 'Manage users & settings' },
    { label: 'Finance', email: 'finance@nexasphere.com', desc: 'Invoices & Transactions' },
    { label: 'Operations', email: 'ops@nexasphere.com', desc: 'Orders & Customers' },
    { label: 'Inventory', email: 'stock@nexasphere.com', desc: 'Products & Reorders' },
    { label: 'Management', email: 'ceo@nexasphere.com', desc: 'Dashboard, Reports & Analytics' },
    { label: 'Platform Admin', email: 'system@nexasphere.com', desc: 'System Health monitor' }
  ];

  const handleQuickLogin = (profileEmail) => {
    setEmail(profileEmail);
    setPassword('password123');
    setTimeout(() => {
      const btn = document.getElementById('login-submit-btn');
      btn?.click();
    }, 100);
  };

  return React.createElement(
    'div',
    { className: 'flex flex-col items-center justify-center min-h-screen bg-neutral-100 px-4' },
    
    React.createElement(
      'div',
      { className: 'w-full max-w-md space-y-6' },
      
      React.createElement(
        'div',
        { className: 'flex flex-col items-center text-center' },
        React.createElement(
          'div',
          { className: 'h-12 w-12 rounded bg-primary-500 flex items-center justify-center text-white mb-3 shadow-md' },
          React.createElement(Activity, { className: 'h-8 w-8' })
        ),
        React.createElement('h2', { className: 'text-2xl font-bold text-neutral-900' }, 'NexaSphere Enterprise'),
        React.createElement('p', { className: 'text-xs text-neutral-500 mt-1' }, 'Scalable Micro-Frontend Architecture Research Model')
      ),

      React.createElement(
        Card,
        null,
        React.createElement(
          CardHeader,
          null,
          React.createElement(CardTitle, null, 'Account Sign In')
        ),
        React.createElement(
          CardContent,
          null,
          error && React.createElement(Alert, { variant: 'error', className: 'mb-4', title: 'Authentication Failed' }, error),
          
          React.createElement(
            'form',
            { onSubmit: handleSubmit, className: 'space-y-4' },
            React.createElement(Input, {
              label: 'Email Address',
              type: 'email',
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: 'name@nexasphere.com',
              required: true
            }),
            React.createElement(Input, {
              label: 'Password',
              type: 'password',
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: '••••••••',
              required: true
            }),
            React.createElement(
              Button,
              {
                id: 'login-submit-btn',
                type: 'submit',
                variant: 'primary',
                className: 'w-full py-2.5',
                loading: loading
              },
              'Sign In'
            )
          )
        )
      ),

      React.createElement(
        Card,
        { className: 'border border-primary-100 bg-primary-50/20' },
        React.createElement(
          CardHeader,
          { className: 'bg-primary-50/50 border-b border-primary-100' },
          React.createElement('span', { className: 'text-xs font-bold text-primary-500' }, 'Quick Testing Profiles')
        ),
        React.createElement(
          CardContent,
          { className: 'p-3 grid grid-cols-2 gap-2' },
          quickProfiles.map(p => React.createElement(
            Button,
            {
              key: p.label,
              variant: 'outline',
              size: 'sm',
              className: 'text-xxs px-2 py-1.5 bg-white border border-neutral-200 text-left justify-start flex flex-col items-start h-auto hover:bg-neutral-50',
              onClick: () => handleQuickLogin(p.email)
            },
            React.createElement('span', { className: 'font-semibold text-neutral-800' }, p.label),
            React.createElement('span', { className: 'text-[9px] text-neutral-500 font-normal truncate w-full' }, p.desc)
          ))
        )
      )
    )
  );
}
