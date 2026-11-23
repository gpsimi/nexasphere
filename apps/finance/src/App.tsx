'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, CardHeader, CardTitle, CardDescription, 
  CardContent, Badge, Button, Input, Select, Modal, 
  Table, TableHeader, TableBody, TableRow, TableCell, 
  TableHeadCell, Alert, StatusDot, Skeleton 
} from '@nexasphere/ui';
import { 
  CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, 
  Plus, Search, Filter, AlertTriangle, CheckCircle2, 
  XCircle, Clock, FileText, Download, ShieldAlert,
  RefreshCw, Check, X
} from 'lucide-react';
import { apiClient, EventBus, formatCurrency } from '@nexasphere/utils';

export default function App() {
  const [shouldCrash, setShouldCrash] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Transaction Form
  const [formData, setFormData] = useState({
    reference: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
    customer: 'Dangote Industries',
    amount: '450000',
    type: 'Income',
    method: 'Direct Bank Transfer',
    status: 'Completed',
    approvalStatus: 'Approved'
  });

  if (shouldCrash) {
    throw new Error('Simulated Finance MFE Runtime Outage (Experiment B: Fault Isolation)');
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      const [txRes, invRes] = await Promise.all([
        apiClient.get('/transactions').catch(() => ({ data: [] })),
        apiClient.get('/invoices').catch(() => ({ data: [] }))
      ]);

      if (txRes.data && txRes.data.length > 0) {
        setTransactions(txRes.data.map(t => ({
          ...t,
          approvalStatus: t.approvalStatus || 'Approved'
        })));
      } else {
        setTransactions([
          { id: '1', reference: 'TXN-9021', date: '2026-08-16', customer: 'Dangote Industries Ltd', amount: 1250000, type: 'Income', method: 'Direct Bank Transfer', status: 'Completed', approvalStatus: 'Approved' },
          { id: '2', reference: 'TXN-9022', date: '2026-08-15', customer: 'Amazon Web Services', amount: 450000, type: 'Expense', method: 'Corporate Card', status: 'Completed', approvalStatus: 'Approved' },
          { id: '3', reference: 'TXN-9023', date: '2026-08-14', customer: 'BUA Cement Plc', amount: 890000, type: 'Income', method: 'Wire Transfer', status: 'Pending', approvalStatus: 'Pending Approval' }
        ]);
      }

      if (invRes.data && invRes.data.length > 0) {
        setInvoices(invRes.data);
      } else {
        setInvoices([
          { id: '1', number: 'INV-2026-001', customer: 'Dangote Industries Ltd', amount: 1250000, issueDate: '2026-08-01', dueDate: '2026-08-30', status: 'Paid' },
          { id: '2', number: 'INV-2026-002', customer: 'BUA Cement Plc', amount: 890000, issueDate: '2026-08-10', dueDate: '2026-09-10', status: 'Unpaid' },
          { id: '3', number: 'INV-2026-003', customer: 'TotalEnergies Marketing', amount: 2100000, issueDate: '2026-07-15', dueDate: '2026-08-15', status: 'Overdue' }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleApproval = (id, newStatus) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        EventBus.publish('NOTIFICATION_RECEIVED', {
          message: `Transaction ${t.reference} marked as ${newStatus}.`,
          type: newStatus === 'Approved' ? 'Success' : newStatus === 'Rejected' ? 'Warning' : 'Information'
        });
        return { ...t, approvalStatus: newStatus };
      }
      return t;
    }));
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const newTx = {
      id: Date.now().toString(),
      reference: formData.reference,
      date: new Date().toISOString().split('T')[0],
      customer: formData.customer,
      amount: parseFloat(formData.amount),
      type: formData.type,
      method: formData.method,
      status: formData.status,
      approvalStatus: formData.approvalStatus
    };

    try {
      await apiClient.post('/transactions', newTx);
    } catch (err) {
      // offline fallback
    }

    setTransactions(prev => [newTx, ...prev]);
    setModalOpen(false);
    setFormData({
      reference: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: 'Dangote Industries',
      amount: '450000',
      type: 'Income',
      method: 'Direct Bank Transfer',
      status: 'Completed',
      approvalStatus: 'Approved'
    });
    setSubmitting(false);

    EventBus.publish('NOTIFICATION_RECEIVED', {
      message: `Transaction ${newTx.reference} recorded for ${newTx.customer} (₦${newTx.amount.toLocaleString()})`,
      type: 'Success'
    });
  };

  const filteredTx = transactions.filter(t => {
    const matchesSearch = t.customer.toLowerCase().includes(search.toLowerCase()) || t.reference.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

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
        React.createElement('h1', { className: 'text-2xl font-extrabold text-neutral-900 tracking-tight' }, 'Financial Management & Invoicing'),
        React.createElement('p', { className: 'text-xs text-neutral-500' }, 'Manage cash flow, audit approval workflows, and enterprise ledger transactions.')
      ),
      React.createElement(
        'div',
        { className: 'flex items-center space-x-3' },
        React.createElement(
          Button,
          { variant: 'outline', size: 'sm', onClick: fetchData, icon: RefreshCw },
          'Refresh'
        ),
        React.createElement(
          Button,
          { variant: 'primary', size: 'sm', onClick: () => setModalOpen(true), icon: Plus },
          'Record Transaction'
        )
      )
    ),

    // Fault Isolation Testing Banner (Experiment B)
    React.createElement(
      Alert,
      {
        variant: 'warning',
        title: '',
        action: React.createElement(
          Button,
          {
            variant: 'danger',
            size: 'xs',
            onClick: () => setShouldCrash(true),
            icon: ShieldAlert
          },
          'Simulate Module Crash'
        )
      },
      'Clicking "Simulate Module Crash" triggers an intentional runtime exception inside Finance MFE. The Shell and other 7 micro-frontends will remain 100% operational.'
    ),

    // Financial KPI Summary Cards
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
      [
        { label: 'Total Revenue', value: '₦24.85M', change: '+12.4%', isPos: true, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Total Inflow', value: '₦18.32M', change: '+15.2%', isPos: true, icon: ArrowUpRight, color: 'text-blue-600 bg-blue-50' },
        { label: 'Operational Outflow', value: '₦6.53M', change: '-2.1%', isPos: false, icon: ArrowDownRight, color: 'text-rose-600 bg-rose-50' },
        { label: 'Pending Invoices', value: '₦3.40M', change: '2 Overdue', isPos: false, icon: Clock, color: 'text-amber-600 bg-amber-50' }
      ].map((k, idx) => React.createElement(
        Card,
        { key: idx, className: 'p-4' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between mb-2' },
          React.createElement('span', { className: 'text-xs font-bold text-neutral-500 uppercase tracking-wider' }, k.label),
          React.createElement('div', { className: `h-9 w-9 rounded-xl flex items-center justify-center ${k.color}` }, React.createElement(k.icon, { className: 'h-5 w-5' }))
        ),
        React.createElement('div', { className: 'text-2xl font-extrabold text-neutral-900' }, k.value),
        React.createElement('span', { className: `text-xs font-semibold mt-1 block ${k.isPos ? 'text-emerald-600' : 'text-rose-600'}` }, k.change)
      ))
    ),

    // Tabs & Content
    React.createElement(
      Card,
      null,
      
      // Tab Switches & Filters Header
      React.createElement(
        'div',
        { className: 'p-4 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-50/50' },
        React.createElement(
          'div',
          { className: 'flex items-center space-x-2' },
          React.createElement(
            'button',
            {
              onClick: () => setActiveTab('transactions'),
              className: `px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'transactions' ? 'bg-primary-700 text-white shadow-xs' : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`
            },
            `Transactions (${transactions.length})`
          ),
          React.createElement(
            'button',
            {
              onClick: () => setActiveTab('invoices'),
              className: `px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'invoices' ? 'bg-primary-700 text-white shadow-xs' : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`
            },
            `Invoices (${invoices.length})`
          )
        ),

        activeTab === 'transactions' && React.createElement(
          'div',
          { className: 'flex items-center space-x-3' },
          React.createElement(Input, {
            placeholder: 'Search customer or reference...',
            icon: Search,
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: 'mb-0 w-64'
          }),
          React.createElement(
            'select',
            {
              value: typeFilter,
              onChange: (e) => setTypeFilter(e.target.value),
              className: 'px-3 py-2 text-xs font-semibold bg-white border border-neutral-300 rounded-lg text-neutral-700 focus:outline-none focus:ring-2 focus:ring-secondary-500/20'
            },
            React.createElement('option', { value: 'ALL' }, 'All Types'),
            React.createElement('option', { value: 'Income' }, 'Income Only'),
            React.createElement('option', { value: 'Expense' }, 'Expense Only')
          )
        )
      ),

      // Transactions View
      activeTab === 'transactions' ? React.createElement(
        Table,
        { className: 'border-0 rounded-none shadow-none' },
        React.createElement(
          TableHeader,
          null,
          React.createElement(
            TableRow,
            null,
            React.createElement(TableHeadCell, null, 'Reference & Date'),
            React.createElement(TableHeadCell, null, 'Customer / Entity'),
            React.createElement(TableHeadCell, null, 'Amount'),
            React.createElement(TableHeadCell, null, 'Payment Method'),
            React.createElement(TableHeadCell, null, 'Approval Workflow (Exp E)'),
            React.createElement(TableHeadCell, { className: 'text-right' }, 'Action')
          )
        ),
        React.createElement(
          TableBody,
          null,
          filteredTx.map(t => React.createElement(
            TableRow,
            { key: t.id },
            React.createElement(
              TableCell,
              null,
              React.createElement('span', { className: 'font-mono font-bold text-neutral-900 block text-xs' }, t.reference),
              React.createElement('span', { className: 'text-[10px] text-neutral-400' }, t.date)
            ),
            React.createElement(TableCell, null, React.createElement('span', { className: 'font-semibold text-neutral-900 text-xs' }, t.customer)),
            React.createElement(
              TableCell,
              null,
              React.createElement(
                'span',
                { className: `font-bold text-xs ${t.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}` },
                `${t.type === 'Income' ? '+' : '-'}₦${t.amount.toLocaleString()}`
              )
            ),
            React.createElement(TableCell, null, React.createElement('span', { className: 'text-xs text-neutral-600' }, t.method)),
            React.createElement(
              TableCell,
              null,
              React.createElement(
                Badge,
                { 
                  variant: t.approvalStatus === 'Approved' ? 'success' : t.approvalStatus === 'Rejected' ? 'error' : 'warning',
                  dot: true 
                },
                t.approvalStatus
              )
            ),
            React.createElement(
              TableCell,
              { className: 'text-right' },
              React.createElement(
                'div',
                { className: 'flex items-center justify-end space-x-1' },
                React.createElement(
                  Button,
                  {
                    variant: t.approvalStatus === 'Approved' ? 'secondary' : 'outline',
                    size: 'xs',
                    onClick: () => handleToggleApproval(t.id, 'Approved'),
                    title: 'Approve'
                  },
                  React.createElement(Check, { className: 'h-3.5 w-3.5' })
                ),
                React.createElement(
                  Button,
                  {
                    variant: t.approvalStatus === 'Rejected' ? 'danger' : 'outline',
                    size: 'xs',
                    onClick: () => handleToggleApproval(t.id, 'Rejected'),
                    title: 'Reject'
                  },
                  React.createElement(X, { className: 'h-3.5 w-3.5' })
                )
              )
            )
          ))
        )
      ) : (
        // Invoices View
        React.createElement(
          Table,
          { className: 'border-0 rounded-none shadow-none' },
          React.createElement(
            TableHeader,
            null,
            React.createElement(
              TableRow,
              null,
              React.createElement(TableHeadCell, null, 'Invoice Number'),
              React.createElement(TableHeadCell, null, 'Client'),
              React.createElement(TableHeadCell, null, 'Amount'),
              React.createElement(TableHeadCell, null, 'Due Date'),
              React.createElement(TableHeadCell, null, 'Status'),
              React.createElement(TableHeadCell, { className: 'text-right' }, 'Action')
            )
          ),
          React.createElement(
            TableBody,
            null,
            invoices.map(inv => React.createElement(
              TableRow,
              { key: inv.id },
              React.createElement(TableCell, null, React.createElement('span', { className: 'font-mono font-bold text-xs' }, inv.number)),
              React.createElement(TableCell, null, React.createElement('span', { className: 'font-semibold text-xs' }, inv.customer)),
              React.createElement(TableCell, null, React.createElement('span', { className: 'font-bold text-xs text-neutral-900' }, `₦${inv.amount.toLocaleString()}`)),
              React.createElement(TableCell, null, React.createElement('span', { className: 'text-xs text-neutral-500' }, inv.dueDate)),
              React.createElement(
                TableCell,
                null,
                React.createElement(
                  Badge,
                  { 
                    variant: inv.status === 'Paid' ? 'success' : inv.status === 'Overdue' ? 'error' : 'warning',
                    dot: true
                  },
                  inv.status
                )
              ),
              React.createElement(
                TableCell,
                { className: 'text-right' },
                React.createElement(
                  Button,
                  {
                    variant: 'outline',
                    size: 'xs',
                    icon: Download,
                    onClick: () => EventBus.publish('NOTIFICATION_RECEIVED', { message: `Downloading ${inv.number} PDF...`, type: 'Information' })
                  },
                  'PDF'
                )
              )
            ))
          )
        )
      )
    ),

    // Create Transaction Modal
    React.createElement(
      Modal,
      {
        isOpen: modalOpen,
        onClose: () => setModalOpen(false),
        title: 'Record Financial Transaction',
        description: 'Post an entry into the enterprise general ledger.'
      },
      React.createElement(
        'form',
        { onSubmit: handleCreateTransaction, className: 'space-y-4' },
        React.createElement(Input, {
          label: 'Transaction Reference',
          value: formData.reference,
          onChange: (e) => setFormData({ ...formData, reference: e.target.value }),
          required: true
        }),
        React.createElement(Input, {
          label: 'Customer / Counterparty',
          value: formData.customer,
          onChange: (e) => setFormData({ ...formData, customer: e.target.value }),
          required: true
        }),
        React.createElement(Input, {
          label: 'Amount (NGN)',
          type: 'number',
          value: formData.amount,
          onChange: (e) => setFormData({ ...formData, amount: e.target.value }),
          required: true
        }),
        React.createElement(Select, {
          label: 'Transaction Flow Type',
          value: formData.type,
          onChange: (e) => setFormData({ ...formData, type: e.target.value }),
          options: [
            { label: 'Income (Cash Inflow)', value: 'Income' },
            { label: 'Expense (Cash Outflow)', value: 'Expense' }
          ]
        }),
        React.createElement(Select, {
          label: 'Payment Method',
          value: formData.method,
          onChange: (e) => setFormData({ ...formData, method: e.target.value }),
          options: [
            { label: 'Direct Bank Transfer', value: 'Direct Bank Transfer' },
            { label: 'Corporate Card', value: 'Corporate Card' },
            { label: 'Wire Transfer', value: 'Wire Transfer' },
            { label: 'Cheque Clearance', value: 'Cheque Clearance' }
          ]
        }),
        React.createElement(
          'div',
          { className: 'flex justify-end space-x-3 pt-4 border-t border-neutral-100' },
          React.createElement(Button, { type: 'button', variant: 'outline', onClick: () => setModalOpen(false) }, 'Cancel'),
          React.createElement(Button, { type: 'submit', variant: 'primary', loading: submitting }, 'Post Transaction')
        )
      )
    )
  );
}
