'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@nexasphere/auth';
import { Spinner } from '@nexasphere/ui';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  return React.createElement(
    'div',
    { className: 'h-screen w-screen flex items-center justify-center bg-neutral-50' },
    React.createElement(Spinner, { className: 'h-8 w-8' })
  );
}
