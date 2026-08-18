'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@nexasphere/auth';
import { Spinner } from '@nexasphere/ui';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (typeof window !== 'undefined') {
        if (isAuthenticated) {
          window.location.replace('/dashboard');
        } else {
          window.location.replace('/login');
        }
      }
    }
  }, [isAuthenticated, loading]);

  return React.createElement(
    'div',
    { className: 'h-screen w-screen flex items-center justify-center bg-neutral-50' },
    React.createElement(Spinner, { size: 'lg' })
  );
}
