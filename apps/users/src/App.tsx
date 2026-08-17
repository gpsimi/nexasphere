'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@nexasphere/auth';
import { 
  Card, CardHeader, CardTitle, CardDescription, 
  CardContent, Badge, Button, Input, Select, Modal, 
  Table, TableHeader, TableBody, TableRow, TableCell, 
  TableHeadCell, Avatar, Alert, StatusDot, Skeleton 
} from '@nexasphere/ui';
import { 
  Users, UserPlus, Search, Filter, ShieldCheck, 
  CheckCircle2, XCircle, MoreVertical, Edit2, Key,
  Mail, Building, RefreshCw, UserCheck, AlertTriangle
} from 'lucide-react';
import { apiClient, EventBus } from '@nexasphere/utils';

export default function App() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // New User Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Operations',
    department: 'Logistics',
    active: true
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/users');
      setUsers(res.data || []);
    } catch (err) {
      console.warn('Using staging fallback users dataset:', err.message);
      setUsers([
        { id: '1', name: 'Godspower Similoluwa', email: 'admin@nexasphere.com', role: 'Admin', department: 'Executive', active: true, lastLogin: '2 mins ago' },
        { id: '2', name: 'Chioma Adebayo', email: 'finance@nexasphere.com', role: 'Finance', department: 'Accounting', active: true, lastLogin: '1 hour ago' },
        { id: '3', name: 'Tunde Bakare', email: 'ops@nexasphere.com', role: 'Operations', department: 'Logistics', active: true, lastLogin: '3 hours ago' },
        { id: '4', name: 'Ngozi Okafor', email: 'stock@nexasphere.com', role: 'Inventory', department: 'Warehouse', active: true, lastLogin: '1 day ago' },
        { id: '5', name: 'Emeka Nwosu', email: 'ceo@nexasphere.com', role: 'Management', department: 'Executive', active: true, lastLogin: '2 days ago' },
        { id: '6', name: 'Amina Yusuf', email: 'system@nexasphere.com', role: 'PlatformAdmin', department: 'DevOps', active: true, lastLogin: 'Just now' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await apiClient.put(`/users/${id}/status`);
    } catch (e) {
      // offline fallback
    }
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = !u.active;
        EventBus.publish('NOTIFICATION_RECEIVED', {
          message: `User ${u.name} status changed to ${nextStatus ? 'Active' : 'Suspended'}.`,
          type: nextStatus ? 'Success' : 'Warning'
        });
        return { ...u, active: nextStatus };
      }
      return u;
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setSubmitting(true);
    try {
      const res = await apiClient.post('/users', formData);
      const newUser = res.data || { id: Date.now().toString(), ...formData, lastLogin: 'Never' };
      setUsers(prev => [newUser, ...prev]);
      setModalOpen(false);
      setFormData({ name: '', email: '', role: 'Operations', department: 'Logistics', active: true });
      setFeedback({ type: 'success', message: `User ${formData.name} successfully created.` });
      EventBus.publish('NOTIFICATION_RECEIVED', {
        message: `New user account created: ${formData.name} (${formData.role})`,
        type: 'Success'
      });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to create user.' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? u.active : !u.active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = [
    { label: 'Total Accounts', value: users.length, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Active Users', value: users.filter(u => u.active).length, icon: UserCheck, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Suspended', value: users.filter(u => !u.active).length, icon: XCircle, color: 'text-rose-600 bg-rose-50' },
    { label: 'Admin Accounts', value: users.filter(u => u.role === 'Admin' || u.role === 'PlatformAdmin').length, icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50' }
  ];

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
        React.createElement('h1', { className: 'text-2xl font-extrabold text-neutral-900 tracking-tight' }, 'User Administration & Governance'),
        React.createElement('p', { className: 'text-xs text-neutral-500' }, 'Manage employee permissions, identity access policies, and organizational roles.')
      ),
      React.createElement(
        'div',
        { className: 'flex items-center space-x-3' },
        React.createElement(
          Button,
          { variant: 'outline', size: 'sm', onClick: fetchUsers, icon: RefreshCw },
          'Refresh'
        ),
        React.createElement(
          Button,
          { variant: 'primary', size: 'sm', onClick: () => setModalOpen(true), icon: UserPlus },
          'Add User'
        )
      )
    ),

    // Stats Grid
    React.createElement(
      'div',
      { className: 'grid grid-cols-2 lg:grid-cols-4 gap-4' },
      stats.map((s, idx) => React.createElement(
        Card,
        { key: idx, className: 'p-4 flex items-center justify-between' },
        React.createElement(
          'div',
          null,
          React.createElement('span', { className: 'text-xs font-bold text-neutral-500 uppercase tracking-wider' }, s.label),
          React.createElement('div', { className: 'text-2xl font-extrabold text-neutral-900 mt-1' }, s.value)
        ),
        React.createElement(
          'div',
          { className: `h-10 w-10 rounded-xl flex items-center justify-center ${s.color}` },
          React.createElement(s.icon, { className: 'h-5 w-5' })
        )
      ))
    ),

    // Feedback Alert
    feedback && React.createElement(
      Alert,
      {
        variant: feedback.type,
        onClose: () => setFeedback(null),
        className: 'animate-in fade-in'
      },
      feedback.message
    ),

    // Filters and Search Bar
    React.createElement(
      Card,
      null,
      React.createElement(
        'div',
        { className: 'p-4 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-neutral-50/40' },
        
        // Search Input
        React.createElement(
          'div',
          { className: 'w-full md:w-80' },
          React.createElement(Input, {
            placeholder: 'Search by name or email...',
            icon: Search,
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: 'mb-0'
          })
        ),

        // Dropdown Filters
        React.createElement(
          'div',
          { className: 'flex flex-wrap items-center gap-2' },
          React.createElement(
            'select',
            {
              value: roleFilter,
              onChange: (e) => setRoleFilter(e.target.value),
              className: 'px-3 py-2 text-xs font-semibold bg-white border border-neutral-300 rounded-lg text-neutral-700 focus:outline-none focus:ring-2 focus:ring-secondary-500/20'
            },
            React.createElement('option', { value: 'ALL' }, 'All Roles'),
            React.createElement('option', { value: 'Admin' }, 'Admin'),
            React.createElement('option', { value: 'Finance' }, 'Finance'),
            React.createElement('option', { value: 'Operations' }, 'Operations'),
            React.createElement('option', { value: 'Inventory' }, 'Inventory'),
            React.createElement('option', { value: 'Management' }, 'Management'),
            React.createElement('option', { value: 'PlatformAdmin' }, 'Platform Admin')
          ),
          React.createElement(
            'select',
            {
              value: statusFilter,
              onChange: (e) => setStatusFilter(e.target.value),
              className: 'px-3 py-2 text-xs font-semibold bg-white border border-neutral-300 rounded-lg text-neutral-700 focus:outline-none focus:ring-2 focus:ring-secondary-500/20'
            },
            React.createElement('option', { value: 'ALL' }, 'All Statuses'),
            React.createElement('option', { value: 'ACTIVE' }, 'Active Only'),
            React.createElement('option', { value: 'SUSPENDED' }, 'Suspended Only')
          )
        )
      ),

      // Users Table
      React.createElement(
        Table,
        { className: 'border-0 rounded-none shadow-none' },
        React.createElement(
          TableHeader,
          null,
          React.createElement(
            TableRow,
            null,
            React.createElement(TableHeadCell, null, 'User Details'),
            React.createElement(TableHeadCell, null, 'Role & Permissions'),
            React.createElement(TableHeadCell, null, 'Department'),
            React.createElement(TableHeadCell, null, 'Status'),
            React.createElement(TableHeadCell, { className: 'text-right' }, 'Action')
          )
        ),
        React.createElement(
          TableBody,
          null,
          loading ? [1, 2, 3, 4].map(k => React.createElement(
            TableRow,
            { key: k },
            React.createElement(TableCell, null, React.createElement(Skeleton, { className: 'h-8 w-48' })),
            React.createElement(TableCell, null, React.createElement(Skeleton, { className: 'h-6 w-24' })),
            React.createElement(TableCell, null, React.createElement(Skeleton, { className: 'h-6 w-28' })),
            React.createElement(TableCell, null, React.createElement(Skeleton, { className: 'h-6 w-16' })),
            React.createElement(TableCell, null, React.createElement(Skeleton, { className: 'h-8 w-20 ml-auto' }))
          )) : filteredUsers.length === 0 ? React.createElement(
            TableRow,
            null,
            React.createElement(
              TableCell,
              { colSpan: 5, className: 'text-center py-10 text-neutral-500 text-xs' },
              'No users found matching your search criteria.'
            )
          ) : filteredUsers.map(u => React.createElement(
            TableRow,
            { key: u.id },
            React.createElement(
              TableCell,
              null,
              React.createElement(
                'div',
                { className: 'flex items-center space-x-3' },
                React.createElement(Avatar, { name: u.name, size: 'sm' }),
                React.createElement(
                  'div',
                  null,
                  React.createElement('span', { className: 'font-bold text-neutral-900 block leading-tight text-xs' }, u.name),
                  React.createElement('span', { className: 'text-[11px] text-neutral-500' }, u.email)
                )
              )
            ),
            React.createElement(
              TableCell,
              null,
              React.createElement(
                Badge,
                { 
                  variant: u.role === 'Admin' ? 'primary' : u.role === 'Finance' ? 'success' : u.role === 'Operations' ? 'secondary' : 'neutral',
                  dot: true 
                },
                u.role
              )
            ),
            React.createElement(
              TableCell,
              null,
              React.createElement('span', { className: 'text-xs text-neutral-600 font-medium' }, u.department || 'Operations')
            ),
            React.createElement(
              TableCell,
              null,
              React.createElement(
                'button',
                {
                  onClick: () => handleToggleStatus(u.id),
                  className: `inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    u.active 
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  }`
                },
                React.createElement(StatusDot, { status: u.active ? 'online' : 'offline' }),
                u.active ? 'Active' : 'Suspended'
              )
            ),
            React.createElement(
              TableCell,
              { className: 'text-right' },
              React.createElement(
                Button,
                {
                  variant: 'ghost',
                  size: 'xs',
                  onClick: () => handleToggleStatus(u.id)
                },
                u.active ? 'Suspend' : 'Activate'
              )
            )
          ))
        )
      )
    ),

    // Add User Modal
    React.createElement(
      Modal,
      {
        isOpen: modalOpen,
        onClose: () => setModalOpen(false),
        title: 'Register New Enterprise User',
        description: 'Provide account details and assign RBAC role permissions.'
      },
      React.createElement(
        'form',
        { onSubmit: handleCreateUser, className: 'space-y-4' },
        React.createElement(Input, {
          label: 'Full Name',
          placeholder: 'e.g. Adeola Williams',
          value: formData.name,
          onChange: (e) => setFormData({ ...formData, name: e.target.value }),
          required: true
        }),
        React.createElement(Input, {
          label: 'Corporate Email',
          type: 'email',
          placeholder: 'adeola@nexasphere.com',
          value: formData.email,
          onChange: (e) => setFormData({ ...formData, email: e.target.value }),
          required: true
        }),
        React.createElement(Select, {
          label: 'Role Assignment',
          value: formData.role,
          onChange: (e) => setFormData({ ...formData, role: e.target.value }),
          options: [
            { label: 'Admin (Full Access)', value: 'Admin' },
            { label: 'Finance Officer (Financial & Invoices)', value: 'Finance' },
            { label: 'Operations Lead (Orders & Customers)', value: 'Operations' },
            { label: 'Inventory Specialist (Stock & Catalog)', value: 'Inventory' },
            { label: 'Executive Management (Analytics & Reports)', value: 'Management' },
            { label: 'Platform Admin (System Telemetry)', value: 'PlatformAdmin' }
          ]
        }),
        React.createElement(Input, {
          label: 'Department',
          placeholder: 'e.g. Accounting, Logistics, Warehouse',
          value: formData.department,
          onChange: (e) => setFormData({ ...formData, department: e.target.value })
        }),
        React.createElement(
          'div',
          { className: 'flex justify-end space-x-3 pt-4 border-t border-neutral-100' },
          React.createElement(Button, { type: 'button', variant: 'outline', onClick: () => setModalOpen(false) }, 'Cancel'),
          React.createElement(Button, { type: 'submit', variant: 'primary', loading: submitting }, 'Create Account')
        )
      )
    )
  );
}
