'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@nexasphere/auth';
import { Spinner } from '@nexasphere/ui';
import { Layout as ShellLayout } from '../components/Layout';

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return React.createElement(
      'div',
      { className: 'h-screen w-screen flex items-center justify-center bg-neutral-50' },
      React.createElement(Spinner, { className: 'h-8 w-8' })
    );
  }

  return React.createElement(ShellLayout, null, children);
}
