'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, CardHeader, CardTitle, CardDescription, 
  CardContent, Badge, Button, Input, Select, Modal, 
  Table, TableHeader, TableBody, TableRow, TableCell, 
  TableHeadCell, Alert, StatusDot 
} from '@nexasphere/ui';
import { 
  ShoppingBag, Users, Truck, CheckCircle2, Clock, 
  Package, Search, Plus, RefreshCw, Eye, ArrowRight
} from 'lucide-react';
import { apiClient, EventBus } from '@nexasphere/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordRes, custRes] = await Promise.all([
        apiClient.get('/orders').catch(() => ({ data: [] })),
        apiClient.get('/customers').catch(() => ({ data: [] }))
      ]);

      if (ordRes.data && ordRes.data.length > 0) {
        setOrders(ordRes.data);
      } else {
        setOrders([
          { id: '1', orderNumber: 'ORD-4491', customer: 'Dangote Industries Ltd', items: '25x Reinforced Steel Rods', amount: 750000, date: '2026-08-16', status: 'Processing' },
          { id: '2', orderNumber: 'ORD-4492', customer: 'BUA Cement Plc', items: '10x Industrial Copper Wire', amount: 320000, date: '2026-08-15', status: 'Dispatched' },
          { id: '3', orderNumber: 'ORD-4493', customer: 'Julius Berger Nigeria', items: '50x Hydraulic Valve Couplings', amount: 1450000, date: '2026-08-14', status: 'Delivered' }
        ]);
      }

      if (custRes.data && custRes.data.length > 0) {
        setCustomers(custRes.data);
      } else {
        setCustomers([
          { id: '1', name: 'Aliko Dangote', company: 'Dangote Industries Ltd', email: 'procure@dangote.com', ordersCount: 14, totalSpend: 18450000, status: 'Active' },
          { id: '2', name: 'Abdul Samad Rabiu', company: 'BUA Cement Plc', email: 'supply@buagroup.com', ordersCount: 9, totalSpend: 9200000, status: 'Active' },
          { id: '3', name: 'Lars Richter', company: 'Julius Berger Nigeria', email: 'logistics@julius-berger.com', ordersCount: 22, totalSpend: 34100000, status: 'Active' }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        EventBus.publish('NOTIFICATION_RECEIVED', {
          message: `Order ${o.orderNumber} status changed to ${newStatus}.`,
          type: 'Success'
        });
        return { ...o, status: newStatus };
      }
      return o;
    }));
  };

  return React.createElement(
    'div',
    { className: 'space-y-6 max-w-7xl mx-auto' },
    
    // Header
    React.createElement(
      'div',
      { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-card' },
      React.createElement(
        'div',
        { className: 'space-y-1' },
        React.createElement('h1', { className: 'text-2xl font-extrabold text-neutral-900 tracking-tight' }, 'Operations & Logistics Console'),
        React.createElement('p', { className: 'text-xs text-neutral-500' }, 'Manage order fulfillment pipelines, logistics dispatch, and enterprise customer relationships.')
      ),
      React.createElement(
        'div',
        { className: 'flex items-center space-x-3' },
        React.createElement(Button, { variant: 'outline', size: 'sm', onClick: fetchData, icon: RefreshCw }, 'Refresh'),
        React.createElement(Button, { variant: 'primary', size: 'sm', onClick: () => setModalOpen(true), icon: Plus }, 'New Order')
      )
    ),

    // Operational KPI Cards
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
      [
        { label: 'Active Orders', value: orders.length, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
        { label: 'In Processing', value: orders.filter(o => o.status === 'Processing').length, icon: Clock, color: 'text-amber-600 bg-amber-50' },
        { label: 'Out for Delivery', value: orders.filter(o => o.status === 'Dispatched').length, icon: Truck, color: 'text-indigo-600 bg-indigo-50' },
        { label: 'Delivered (YTD)', value: '1,245', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' }
      ].map((k, idx) => React.createElement(
        Card,
        { key: idx, className: 'p-4' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between mb-2' },
          React.createElement('span', { className: 'text-xs font-bold text-neutral-500 uppercase tracking-wider' }, k.label),
          React.createElement('div', { className: `h-9 w-9 rounded-xl flex items-center justify-center ${k.color}` }, React.createElement(k.icon, { className: 'h-5 w-5' }))
        ),
        React.createElement('div', { className: 'text-2xl font-extrabold text-neutral-900' }, k.value)
      ))
    ),

    // Main Workspace
    React.createElement(
      Card,
      null,
      React.createElement(
        'div',
        { className: 'p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50' },
        React.createElement(
          'div',
          { className: 'flex items-center space-x-2' },
          React.createElement(
            'button',
            {
              onClick: () => setActiveTab('orders'),
              className: `px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'orders' ? 'bg-primary-700 text-white shadow-xs' : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`
            },
            `Fulfillment Orders (${orders.length})`
          ),
          React.createElement(
            'button',
            {
              onClick: () => setActiveTab('customers'),
              className: `px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'customers' ? 'bg-primary-700 text-white shadow-xs' : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`
            },
            `Enterprise Accounts (${customers.length})`
          )
        ),
        React.createElement(Input, {
          placeholder: 'Filter records...',
          icon: Search,
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: 'mb-0 w-64'
        })
      ),

      activeTab === 'orders' ? React.createElement(
        Table,
        { className: 'border-0 rounded-none shadow-none' },
        React.createElement(
          TableHeader,
          null,
          React.createElement(
            TableRow,
            null,
            React.createElement(TableHeadCell, null, 'Order ID & Date'),
            React.createElement(TableHeadCell, null, 'Customer'),
            React.createElement(TableHeadCell, null, 'Items Summary'),
            React.createElement(TableHeadCell, null, 'Order Value'),
            React.createElement(TableHeadCell, null, 'Fulfillment Status'),
            React.createElement(TableHeadCell, { className: 'text-right' }, 'Action')
          )
        ),
        React.createElement(
          TableBody,
          null,
          orders.map(o => React.createElement(
            TableRow,
            { key: o.id },
            React.createElement(
              TableCell,
              null,
              React.createElement('span', { className: 'font-mono font-bold text-neutral-900 block text-xs' }, o.orderNumber),
              React.createElement('span', { className: 'text-[10px] text-neutral-400' }, o.date)
            ),
            React.createElement(TableCell, null, React.createElement('span', { className: 'font-semibold text-xs text-neutral-900' }, o.customer)),
            React.createElement(TableCell, null, React.createElement('span', { className: 'text-xs text-neutral-600' }, o.items)),
            React.createElement(TableCell, null, React.createElement('span', { className: 'font-bold text-xs text-neutral-900' }, `₦${o.amount.toLocaleString()}`)),
            React.createElement(
              TableCell,
              null,
              React.createElement(
                Badge,
                {
                  variant: o.status === 'Delivered' ? 'success' : o.status === 'Dispatched' ? 'secondary' : 'warning',
                  dot: true
                },
                o.status
              )
            ),
            React.createElement(
              TableCell,
              { className: 'text-right' },
              o.status === 'Processing' && React.createElement(
                Button,
                {
                  variant: 'outline',
                  size: 'xs',
                  onClick: () => handleUpdateOrderStatus(o.id, 'Dispatched')
                },
                'Dispatch'
              ),
              o.status === 'Dispatched' && React.createElement(
                Button,
                {
                  variant: 'success',
                  size: 'xs',
                  onClick: () => handleUpdateOrderStatus(o.id, 'Delivered')
                },
                'Mark Delivered'
              ),
              o.status === 'Delivered' && React.createElement(
                Badge,
                { variant: 'neutral', className: 'text-[10px]' },
                'Completed'
              )
            )
          ))
        )
      ) : (
        Table,
        { className: 'border-0 rounded-none shadow-none' },
        React.createElement(
          TableHeader,
          null,
          React.createElement(
            TableRow,
            null,
            React.createElement(TableHeadCell, null, 'Company & Contact'),
            React.createElement(TableHeadCell, null, 'Email'),
            React.createElement(TableHeadCell, null, 'Orders Placed'),
            React.createElement(TableHeadCell, null, 'Lifetime Volume'),
            React.createElement(TableHeadCell, null, 'Status')
          )
        ),
        React.createElement(
          TableBody,
          null,
          customers.map(c => React.createElement(
            TableRow,
            { key: c.id },
            React.createElement(
              TableCell,
              null,
              React.createElement('span', { className: 'font-bold text-neutral-900 block text-xs' }, c.company),
              React.createElement('span', { className: 'text-[11px] text-neutral-500' }, c.name)
            ),
            React.createElement(TableCell, null, React.createElement('span', { className: 'text-xs text-neutral-600' }, c.email)),
            React.createElement(TableCell, null, React.createElement('span', { className: 'font-semibold text-xs' }, `${c.ordersCount} orders`)),
            React.createElement(TableCell, null, React.createElement('span', { className: 'font-bold text-xs text-emerald-600' }, `₦${c.totalSpend.toLocaleString()}`)),
            React.createElement(TableCell, null, React.createElement(Badge, { variant: 'success', dot: true }, c.status))
          ))
        )
      )
    )
  );
}
