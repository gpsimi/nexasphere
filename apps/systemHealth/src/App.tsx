'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Table, TableHeader, TableBody, TableRow, TableCell, TableHeadCell } from '@nexasphere/ui';
import { Heart, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function App() {
  const [remotes, setRemotes] = useState([]);

  useEffect(() => {
    setRemotes([
      { name: 'Application Shell (Host)', port: 3000, status: 'Online', latency: '2 ms' },
      { name: 'Dashboard MFE', port: 3001, status: 'Online', latency: '4 ms' },
      { name: 'Users MFE', port: 3002, status: 'Online', latency: '6 ms' },
      { name: 'Finance MFE', port: 3003, status: 'Online', latency: '5 ms' },
      { name: 'Operations MFE', port: 3004, status: 'Online', latency: '4 ms' },
      { name: 'Inventory MFE', port: 3005, status: 'Online', latency: '6 ms' },
      { name: 'Reports MFE', port: 3006, status: 'Online', latency: '8 ms' },
      { name: 'Analytics MFE', port: 3007, status: 'Online', latency: '9 ms' }
    ]);
  }, []);

  return React.createElement(
    'div',
    { className: 'space-y-6' },
    
    // Status metrics
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
      React.createElement(
        Card,
        { className: 'p-6 flex items-center justify-between border-l-4 border-l-green-500 bg-white' },
        React.createElement(
          'div',
          null,
          React.createElement('span', { className: 'text-xs text-neutral-500 font-semibold' }, 'Global System Health'),
          React.createElement('h3', { className: 'text-2xl font-bold text-green-700 mt-1' }, '100% Operational')
        ),
        React.createElement(Heart, { className: 'h-8 w-8 text-green-500 animate-pulse' })
      ),
      React.createElement(
        Card,
        { className: 'p-6 flex items-center justify-between border-l-4 border-l-primary-500 bg-white' },
        React.createElement(
          'div',
          null,
          React.createElement('span', { className: 'text-xs text-neutral-500 font-semibold' }, 'Avg API Response Time'),
          React.createElement('h3', { className: 'text-2xl font-bold text-primary-700 mt-1' }, '42 ms')
        ),
        React.createElement(Activity, { className: 'h-8 w-8 text-primary-500' })
      ),
      React.createElement(
        Card,
        { className: 'p-6 flex items-center justify-between border-l-4 border-l-secondary-500 bg-white' },
        React.createElement(
          'div',
          null,
          React.createElement('span', { className: 'text-xs text-neutral-500 font-semibold' }, 'Active Failures Logged'),
          React.createElement('h3', { className: 'text-2xl font-bold text-neutral-900 mt-1' }, '0 Outages')
        ),
        React.createElement(ShieldCheck, { className: 'h-8 w-8 text-secondary-500' })
      )
    ),

    // Remotes grid table
    React.createElement(
      Card,
      null,
      React.createElement(
        CardHeader,
        null,
        React.createElement(CardTitle, null, 'Isolated Micro-Frontend Health Registry')
      ),
      React.createElement(
        CardContent,
        null,
        React.createElement(
          Table,
          null,
          React.createElement(
            TableHeader,
            null,
            React.createElement(
              TableRow,
              null,
              React.createElement(TableHeadCell, null, 'Module Service'),
              React.createElement(TableHeadCell, null, 'Target Port'),
              React.createElement(TableHeadCell, null, 'Runtime Latency'),
              React.createElement(TableHeadCell, null, 'Active Status')
            )
          ),
          React.createElement(
            TableBody,
            null,
            remotes.map(r => React.createElement(
              TableRow,
              { key: r.name },
              React.createElement(TableCell, { className: 'font-semibold' }, r.name),
              React.createElement(TableCell, null, `:${r.port}`),
              React.createElement(TableCell, null, r.latency),
              React.createElement(
                TableCell,
                null,
                React.createElement(Badge, { variant: 'success', className: 'text-xxs px-1.5' }, r.status)
              )
            ))
          )
        )
      )
    )
  );
}
