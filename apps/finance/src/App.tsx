'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Select, Table, TableHeader, TableBody, TableRow, TableCell, TableHeadCell, Alert } from '@nexasphere/ui';
import { Search, Plus, Filter, DollarSign, FileText, CheckCircle, Clock, AlertTriangle, Play } from 'lucide-react';
import { EventBus } from '@nexasphere/utils';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Failure simulation state
  const [shouldCrash, setShouldCrash] = useState(false);

  // If simulate crash is toggled, throw an error to trigger MfeErrorBoundary
  if (shouldCrash) {
    throw new Error('Simulated Finance MFE Runtime Outage (Experiment B)');
  }

  useEffect(() => {
    // Populate mock financial data with approvalStatus (Experiment E)
    setTransactions([
      { id: '1', reference: 'TXN-88092', date: '2026-08-14', customer: 'Acme Logistics Ltd', amount: 145000, type: 'Income', paymentMethod: 'Bank Transfer', status: 'Completed', approvalStatus: 'Approved' },
      { id: '2', reference: 'TXN-88093', date: '2026-08-13', customer: 'Halal Foods Nigeria', amount: 85000, type: 'Income', paymentMethod: 'Card', status: 'Completed', approvalStatus: 'Approved' },
      { id: '3', reference: 'TXN-88094', date: '2026-08-13', customer: 'Covenant University', amount: 1200000, type: 'Income', paymentMethod: 'Bank Transfer', status: 'Pending', approvalStatus: 'Pending Approval' },
      { id: '4', reference: 'TXN-88095', date: '2026-08-12', customer: 'Globals Ltd', amount: 35000, type: 'Expense', paymentMethod: 'Cash', status: 'Completed', approvalStatus: 'Approved' },
      { id: '5', reference: 'TXN-88096', date: '2026-08-11', customer: 'Lagos State Water Corp', amount: 18000, type: 'Expense', paymentMethod: 'USSD', status: 'Failed', approvalStatus: 'Rejected' }
    ]);

    setInvoices([
      { id: '1', invoiceNumber: 'INV-8890', customer: 'Acme Logistics Ltd', amount: 145000, dueDate: '2026-08-30', status: 'Paid' },
      { id: '2', invoiceNumber: 'INV-8891', customer: 'Covenant University', amount: 1200000, dueDate: '2026-08-25', status: 'Unpaid' },
      { id: '3', invoiceNumber: 'INV-8892', customer: 'Globals Ltd', amount: 35000, dueDate: '2026-08-10', status: 'Overdue' }
    ]);
  }, []);

  const handleToggleApproval = (txnId) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === txnId) {
        const nextStatus = t.approvalStatus === 'Approved' ? 'Pending Approval' : 'Approved';
        EventBus.publish('NOTIFICATION_RECEIVED', {
          message: `Transaction ${t.reference} approval status updated to: ${nextStatus}`,
          type: 'Information'
        });
        return { ...t, approvalStatus: nextStatus };
      }
      return t;
    }));
  };

  const handleCreateTransaction = () => {
    const newTxn = {
      id: (transactions.length + 1).toString(),
      reference: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      customer: 'Quick Payment Client',
      amount: 45000,
      type: 'Income',
      paymentMethod: 'Bank Transfer',
      status: 'Completed',
      approvalStatus: 'Approved'
    };

    setTransactions(prev => [newTxn, ...prev]);

    // Emit event over bus so shell can display toast notification
    EventBus.publish('NOTIFICATION_RECEIVED', {
      message: `Invoice payment registered: ${newTxn.reference} (Amount: ₦45,000)`,
      type: 'Success'
    });
  };

  const filteredTxns = transactions.filter(t => {
    const matchesSearch = t.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return React.createElement(
    'div',
    { className: 'space-y-6' },
    
    // Outage Testing Console Header
    React.createElement(
      Alert,
      {
        variant: 'warning',
        title: 'Outage Testing Panel (Experiment B)',
        action: React.createElement(
          Button,
          { variant: 'danger', size: 'sm', onClick: () => setShouldCrash(true) },
          'Simulate Module Crash'
        )
      },
      'Clicking the crash button will trigger an intentional javascript exception inside this MFE. This evaluates Objective O3 (Fault Isolation boundaries).'
    ),

    // KPI Finance Cards
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
      React.createElement(
        Card,
        { className: 'flex p-6 items-center justify-between border-l-4 border-l-green-500' },
        React.createElement(
          'div',
          null,
          React.createElement('span', { className: 'text-xs text-neutral-500 font-semibold' }, 'Total Revenue Recieved'),
          React.createElement('h2', { className: 'text-3xl font-bold text-neutral-900 mt-1' }, '₦24.8M')
        ),
        React.createElement(
          'div',
          { className: 'h-12 w-12 bg-green-50 rounded-full flex items-center justify-center text-green-700' },
          React.createElement(DollarSign, { className: 'h-6 w-6' })
        )
      ),
      React.createElement(
        Card,
        { className: 'flex p-6 items-center justify-between border-l-4 border-l-red-500' },
        React.createElement(
          'div',
          null,
          React.createElement('span', { className: 'text-xs text-neutral-500 font-semibold' }, 'Outstanding Invoices Balance'),
          React.createElement('h2', { className: 'text-3xl font-bold text-neutral-900 mt-1' }, '₦3.4M')
        ),
        React.createElement(
          'div',
          { className: 'h-12 w-12 bg-red-50 rounded-full flex items-center justify-center text-red-700' },
          React.createElement(FileText, { className: 'h-6 w-6' })
        )
      )
    ),

    // Transactions Table
    React.createElement(
      Card,
      null,
      React.createElement(
        CardHeader,
        { className: 'flex justify-between items-center' },
        React.createElement(CardTitle, null, 'Transactions Log'),
        React.createElement(
          Button,
          { variant: 'primary', size: 'sm', onClick: handleCreateTransaction },
          React.createElement(Plus, { className: 'h-4 w-4 mr-1.5' }),
          'Record Transaction'
        )
      ),
      React.createElement(
        CardContent,
        { className: 'space-y-4' },
        
        // Search & filter
        React.createElement(
          'div',
          { className: 'flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-neutral-50 p-3 border border-neutral-200 rounded' },
          React.createElement(
            'div',
            { className: 'flex-1 relative' },
            React.createElement(Search, { className: 'absolute left-3 top-2.5 h-4 w-4 text-neutral-400' }),
            React.createElement('input', {
              type: 'text',
              placeholder: 'Search reference, customer, method...',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: 'w-full pl-9 pr-3 py-2 text-sm bg-white border rounded border-neutral-200 focus:outline-none focus:ring-1 focus:ring-primary-500'
            })
          ),
          React.createElement(
            'div',
            { className: 'flex items-center space-x-1.5' },
            React.createElement(Filter, { className: 'h-4 w-4 text-neutral-400' }),
            React.createElement('select', {
              value: selectedStatus,
              onChange: (e) => setSelectedStatus(e.target.value),
              className: 'px-2 py-1.5 text-xs bg-white border rounded border-neutral-200 focus:outline-none'
            },
              ['All', 'Completed', 'Pending', 'Failed'].map(st => 
                React.createElement('option', { key: st, value: st }, st)
              )
            )
          )
        ),

        // Grid table
        React.createElement(
          Table,
          null,
          React.createElement(
            TableHeader,
            null,
            React.createElement(
              TableRow,
              null,
              React.createElement(TableHeadCell, null, 'Reference'),
              React.createElement(TableHeadCell, null, 'Date'),
              React.createElement(TableHeadCell, null, 'Customer'),
              React.createElement(TableHeadCell, null, 'Amount'),
              React.createElement(TableHeadCell, null, 'Payment Method'),
              React.createElement(TableHeadCell, null, 'Status'),
              React.createElement(TableHeadCell, null, 'Approval')
            )
          ),
          React.createElement(
            TableBody,
            null,
            filteredTxns.map(t => React.createElement(
              TableRow,
              { key: t.id },
              React.createElement(TableCell, { className: 'font-semibold' }, t.reference),
              React.createElement(TableCell, null, t.date),
              React.createElement(TableCell, null, t.customer),
              React.createElement(TableCell, { className: 'font-bold' }, `₦${t.amount.toLocaleString()}`),
              React.createElement(TableCell, null, t.paymentMethod),
              React.createElement(
                TableCell,
                null,
                React.createElement(
                  Badge,
                  { 
                    variant: t.status === 'Completed' ? 'success' : t.status === 'Pending' ? 'warning' : 'error',
                    className: 'text-xxs px-1.5'
                  },
                  t.status
                )
              ),
              React.createElement(
                TableCell,
                null,
                React.createElement(
                  'button',
                  {
                    onClick: () => handleToggleApproval(t.id),
                    className: 'cursor-pointer hover:opacity-80 transition-opacity'
                  },
                  React.createElement(
                    Badge,
                    {
                      variant: t.approvalStatus === 'Approved' ? 'success' : t.approvalStatus === 'Rejected' ? 'error' : 'warning',
                      className: 'text-xxs px-2 py-0.5'
                    },
                    t.approvalStatus || 'Pending Approval'
                  )
                )
              )
            ))
          )
        )
      )
    ),

    // Invoices list layout
    React.createElement(
      Card,
      null,
      React.createElement(
        CardHeader,
        null,
        React.createElement(CardTitle, null, 'Invoices Pending Payment')
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
              React.createElement(TableHeadCell, null, 'Invoice Number'),
              React.createElement(TableHeadCell, null, 'Customer'),
              React.createElement(TableHeadCell, null, 'Amount'),
              React.createElement(TableHeadCell, null, 'Due Date'),
              React.createElement(TableHeadCell, null, 'Status')
            )
          ),
          React.createElement(
            TableBody,
            null,
            invoices.map(inv => React.createElement(
              TableRow,
              { key: inv.id },
              React.createElement(TableCell, { className: 'font-semibold text-neutral-800' }, inv.invoiceNumber),
              React.createElement(TableCell, null, inv.customer),
              React.createElement(TableCell, { className: 'font-semibold' }, `₦${inv.amount.toLocaleString()}`),
              React.createElement(TableCell, null, inv.dueDate),
              React.createElement(
                TableCell,
                null,
                React.createElement(
                  Badge,
                  { 
                    variant: inv.status === 'Paid' ? 'success' : inv.status === 'Unpaid' ? 'warning' : 'error',
                    className: 'text-xxs px-1.5'
                  },
                  inv.status
                )
              )
            ))
          )
        )
      )
    )
  );
}
