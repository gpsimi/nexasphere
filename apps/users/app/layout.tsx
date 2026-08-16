'use client';

import React from 'react';
import { AuthProvider } from '@nexasphere/auth';
import { Layout } from './components/Layout';
import { MfeErrorBoundary } from './components/MfeErrorBoundary';
import '../src/index.css';

export default function RootLayout({ children }) {
  return React.createElement(
    'html',
    { lang: 'en' },
    React.createElement(
      'body',
      { className: 'bg-neutral-50' },
      React.createElement(
        AuthProvider,
        null,
        React.createElement(
          Layout,
          null,
          React.createElement(
            MfeErrorBoundary,
            { name: 'Users' },
            children
          )
        )
      )
    )
  );
}
