import React from 'react';
import { AuthProvider } from '@nexasphere/auth';
import './globals.css';

export const metadata = {
  title: 'NexaSphere Enterprise Portal',
  description: 'Scalable Micro-Frontend Architecture Research Model',
};

export default function RootLayout({ children }) {
  return React.createElement(
    'html',
    { lang: 'en' },
    React.createElement(
      'body',
      { className: 'bg-neutral-50 text-neutral-900' },
      React.createElement(
        AuthProvider,
        null,
        children
      )
    )
  );
}
