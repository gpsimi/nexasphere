'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Select, Table, TableHeader, TableBody, TableRow, TableCell, TableHeadCell } from '@nexasphere/ui';
import { Search, Plus, Filter, Users, TrendingUp, Clock, ShoppingCart } from 'lucide-react';
import { EventBus } from '@nexasphere/utils';

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setCustomers([
      { id: '1', code: 'CUST-001', name: 'Acme Logistics Ltd', region: 'Lagos', status: 'Active', balance: 145000 },
      { id: '2', code: 'CUST-002', name: 'Halal Foods Nigeria', region: 'Kano', status: 'Active', balance: 0 },
      { id: '3', code: 'CUST-003', name: 'Covenant University', region: 'Ogun', status: 'Active', balance: 1200000 },
      { id: '4', code: 'CUST-004', name: 'Globals Ltd', region: 'Abuja', status: 'Active', balance: 35000 }
    ]);

    setOrders([
      { id: '1', reference: 'ORD-4491', customer: 'Acme Logistics Ltd', amount: 75000, date: '2026-08-14', status: 'Pending' },
      { id: '2', reference: 'ORD-4492', customer: 'Halal Foods Nigeria', amount: 85000, date: '2026-08-13', status: 'Shipped' },
      { id: '3', reference: 'ORD-4493', customer: 'Globals Ltd', amount: 35000, date: '2026-08-12', status: 'Delivered' }
    ]);
  }, []);

  const handleShipOrder = (orderId) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        EventBus.publish('NOTIFICATION_RECEIVED', {
          message: `Order ${o.reference} marked as Shipped`,
          type: 'Success'
        });
        return { ...o, status: 'Shipped' };
      }
      return o;
    }));
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return React.createElement(
    'div',
    { className: 'space-y-6' },
    
    // Overview metrics
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
      React.createElement(
        Card,
        { className: 'p-4' },
        React.createElement('span', { className: 'text-xs text-neutral-500 font-semibold' }, 'Active Customers'),
        React.createElement('h3', { className: 'text-2xl font-bold text-neutral-900 mt-1' }, customers.length)
      ),
      React.createElement(
        Card,
        { className: 'p-4' },
        React.createElement('span', { className: 'text-xs text-neutral-500 font-semibold' }, 'Pending Orders'),
        React.createElement('h3', { className: 'text-2xl font-bold text-warning-700 mt-1' }, orders.filter(o => o.status === 'Pending').length)
      ),
      React.createElement(
        Card,
        { className: 'p-4' },
        React.createElement('span', { className: 'text-xs text-neutral-500 font-semibold' }, 'Shipped Orders'),
        React.createElement('h3', { className: 'text-2xl font-bold text-green-700 mt-1' }, orders.filter(o => o.status === 'Shipped').length)
      )
    ),

    // Customers list
    React.createElement(
      Card,
      null,
      React.createElement(
        CardHeader,
        { className: 'flex justify-between items-center' },
        React.createElement(CardTitle, null, 'Customer Registry'),
        React.createElement(
          'div',
          { className: 'relative max-w-xs w-64' },
          React.createElement(Search, { className: 'absolute left-2.5 top-2 h-4 w-4 text-neutral-400' }),
          React.createElement('input', {
            type: 'text',
            placeholder: 'Search customer registry...',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: 'w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border rounded border-neutral-200 focus:outline-none'
          })
        )
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
              React.createElement(TableHeadCell, null, 'Code'),
              React.createElement(TableHeadCell, null, 'Customer Name'),
              React.createElement(TableHeadCell, null, 'Region'),
              React.createElement(TableHeadCell, null, 'Outstanding Balance'),
              React.createElement(TableHeadCell, null, 'Status')
            )
          ),
          React.createElement(
            TableBody,
            null,
            filteredCustomers.map(c => React.createElement(
              TableRow,
              { key: c.id },
              React.createElement(TableCell, { className: 'font-semibold' }, c.code),
              React.createElement(TableCell, null, c.name),
              React.createElement(TableCell, null, c.region),
              React.createElement(TableCell, { className: 'font-bold' }, `₦${c.balance.toLocaleString()}`),
              React.createElement(
                TableCell,
                null,
                React.createElement(Badge, { variant: 'success', className: 'text-xxs' }, c.status)
              )
            ))
          )
        )
      )
    ),

    // Order Processing list
    React.createElement(
      Card,
      null,
      React.createElement(
        CardHeader,
        null,
        React.createElement(CardTitle, null, 'Recent Operations Orders')
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
              React.createElement(TableHeadCell, null, 'Order Reference'),
              React.createElement(TableHeadCell, null, 'Customer'),
              React.createElement(TableHeadCell, null, 'Amount'),
              React.createElement(TableHeadCell, null, 'Date Ordered'),
              React.createElement(TableHeadCell, null, 'Status'),
              React.createElement(TableHeadCell, null, 'Actions')
            )
          ),
          React.createElement(
            TableBody,
            null,
            orders.map(o => React.createElement(
              TableRow,
              { key: o.id },
              React.createElement(TableCell, { className: 'font-semibold text-neutral-800' }, o.reference),
              React.createElement(TableCell, null, o.customer),
              React.createElement(TableCell, { className: 'font-semibold' }, `₦${o.amount.toLocaleString()}`),
              React.createElement(TableCell, null, o.date),
              React.createElement(
                TableCell,
                null,
                React.createElement(
                  Badge,
                  { 
                    variant: o.status === 'Delivered' ? 'success' : o.status === 'Shipped' ? 'primary' : 'warning',
                    className: 'text-xxs px-1.5'
                  },
                  o.status
                )
              ),
              React.createElement(
                TableCell,
                null,
                o.status === 'Pending' && React.createElement(
                  Button,
                  { variant: 'outline', size: 'sm', className: 'text-xxs px-2 py-1', onClick: () => handleShipOrder(o.id) },
                  'Mark Shipped'
                )
              )
            ))
          )
        )
      )
    )
  );
}
