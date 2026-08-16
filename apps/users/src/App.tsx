'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Select, Table, TableHeader, TableBody, TableRow, TableCell, TableHeadCell } from '@nexasphere/ui';
import { Search, Plus, Filter, UserCheck, ShieldAlert, UserX, Settings } from 'lucide-react';
import { EventBus } from '@nexasphere/utils';

export default function App() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Operations');
  const [department, setDepartment] = useState('Operations');

  useEffect(() => {
    // Initial mock user population
    setUsers([
      { id: '1', name: 'Godspower Similoluwa', email: 'admin@nexasphere.com', role: 'Admin', department: 'Engineering', status: 'Active', createdAt: '2026-08-01' },
      { id: '2', name: 'Kunle Adeleke', email: 'finance@nexasphere.com', role: 'Finance', department: 'Finance', status: 'Active', createdAt: '2026-08-05' },
      { id: '3', name: 'Tunde Bakare', email: 'ops@nexasphere.com', role: 'Operations', department: 'Operations', status: 'Active', createdAt: '2026-08-10' },
      { id: '4', name: 'Chinedu Okafor', email: 'stock@nexasphere.com', role: 'Inventory', department: 'Logistics', status: 'Active', createdAt: '2026-08-11' },
      { id: '5', name: 'Sarah Alabi', email: 'ceo@nexasphere.com', role: 'Management', department: 'Executive', status: 'Active', createdAt: '2026-08-12' },
      { id: '6', name: 'David Smith', email: 'system@nexasphere.com', role: 'PlatformAdmin', department: 'Infrastructure', status: 'Active', createdAt: '2026-08-13' }
    ]);
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      alert('Please fill out all fields');
      return;
    }

    const newUser = {
      id: (users.length + 1).toString(),
      name: `${firstName} ${lastName}`,
      email,
      role,
      department,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [newUser, ...prev]);
    setShowAddModal(false);
    
    // Reset fields
    setFirstName('');
    setLastName('');
    setEmail('');
    
    // Broadcast notification through global event bus
    EventBus.publish('NOTIFICATION_RECEIVED', {
      message: `User account created: ${newUser.name} (${newUser.role})`,
      type: 'Success'
    });
  };

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        
        EventBus.publish('NOTIFICATION_RECEIVED', {
          message: `User ${u.name} status changed to ${nextStatus}`,
          type: nextStatus === 'Active' ? 'Success' : 'Warning'
        });
        
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Filter logic
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const activeCount = users.filter(u => u.status === 'Active').length;
  const inactiveCount = users.filter(u => u.status === 'Inactive').length;

  return React.createElement(
    'div',
    { className: 'space-y-6' },
    
    // Stats Summary Headers
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
      React.createElement(
        Card,
        { className: 'p-4' },
        React.createElement('span', { className: 'text-xs text-neutral-500 font-semibold' }, 'Total Users'),
        React.createElement('h3', { className: 'text-2xl font-bold text-neutral-900 mt-1' }, users.length)
      ),
      React.createElement(
        Card,
        { className: 'p-4' },
        React.createElement('span', { className: 'text-xs text-neutral-500 font-semibold' }, 'Active Accounts'),
        React.createElement('h3', { className: 'text-2xl font-bold text-green-700 mt-1' }, activeCount)
      ),
      React.createElement(
        Card,
        { className: 'p-4' },
        React.createElement('span', { className: 'text-xs text-neutral-500 font-semibold' }, 'Suspended Accounts'),
        React.createElement('h3', { className: 'text-2xl font-bold text-red-700 mt-1' }, inactiveCount)
      )
    ),

    // Search and Operations bar
    React.createElement(
      'div',
      { className: 'flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white p-4 border border-neutral-200 rounded' },
      React.createElement(
        'div',
        { className: 'flex-1 relative max-w-md' },
        React.createElement(Search, { className: 'absolute left-3 top-2.5 h-4 w-4 text-neutral-400' }),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Search name, email, department...',
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          className: 'w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border rounded border-neutral-200 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500'
        })
      ),
      React.createElement(
        'div',
        { className: 'flex items-center gap-3' },
        React.createElement(
          'div',
          { className: 'flex items-center space-x-1.5' },
          React.createElement(Filter, { className: 'h-4 w-4 text-neutral-400' }),
          React.createElement('select', {
            value: selectedRole,
            onChange: (e) => setSelectedRole(e.target.value),
            className: 'px-2 py-1.5 text-xs bg-neutral-50 border rounded border-neutral-200 focus:outline-none'
          },
            ['All', 'Admin', 'Finance', 'Operations', 'Inventory', 'Management', 'PlatformAdmin'].map(r => 
              React.createElement('option', { key: r, value: r }, r)
            )
          )
        ),
        React.createElement(
          Button,
          { variant: 'primary', size: 'sm', onClick: () => setShowAddModal(true) },
          React.createElement(Plus, { className: 'h-4 w-4 mr-1.5' }),
          'Add User'
        )
      )
    ),

    // Users Management Table
    React.createElement(
      Table,
      null,
      React.createElement(
        TableHeader,
        null,
        React.createElement(
          TableRow,
          null,
          React.createElement(TableHeadCell, null, 'User'),
          React.createElement(TableHeadCell, null, 'Role'),
          React.createElement(TableHeadCell, null, 'Department'),
          React.createElement(TableHeadCell, null, 'Status'),
          React.createElement(TableHeadCell, null, 'Date Added'),
          React.createElement(TableHeadCell, null, 'Actions')
        )
      ),
      React.createElement(
        TableBody,
        null,
        filteredUsers.map(u => React.createElement(
          TableRow,
          { key: u.id },
          React.createElement(
            TableCell,
            null,
            React.createElement(
              'div',
              { className: 'flex flex-col' },
              React.createElement('span', { className: 'font-semibold text-neutral-900 text-sm' }, u.name),
              React.createElement('span', { className: 'text-neutral-500 text-xs' }, u.email)
            )
          ),
          React.createElement(
            TableCell,
            null,
            React.createElement(
              Badge,
              { 
                variant: u.role === 'Admin' ? 'error' : u.role === 'PlatformAdmin' ? 'warning' : 'primary',
                className: 'text-xxs px-1.5'
              },
              u.role
            )
          ),
          React.createElement(TableCell, null, u.department),
          React.createElement(
            TableCell,
            null,
            React.createElement(
              Badge,
              { variant: u.status === 'Active' ? 'success' : 'neutral', className: 'text-xxs px-1.5' },
              u.status
            )
          ),
          React.createElement(TableCell, null, u.createdAt),
          React.createElement(
            TableCell,
            null,
            React.createElement(
              'div',
              { className: 'flex items-center space-x-2' },
              React.createElement(
                Button,
                { 
                  variant: 'outline', 
                  size: 'sm', 
                  className: 'p-1 hover:bg-neutral-100',
                  onClick: () => toggleUserStatus(u.id) 
                },
                u.status === 'Active' 
                  ? React.createElement(UserX, { className: 'h-4 w-4 text-red-500' })
                  : React.createElement(UserCheck, { className: 'h-4 w-4 text-green-600' })
              )
            )
          )
        ))
      )
    ),

    // Add User Modal Dialog Box
    showAddModal && React.createElement(
      'div',
      { className: 'fixed inset-0 z-50 flex items-center justify-center' },
      React.createElement('div', { 
        className: 'fixed inset-0 bg-neutral-900/50', 
        onClick: () => setShowAddModal(false) 
      }),
      React.createElement(
        'div',
        { className: 'relative z-10 w-full max-w-md bg-white border border-neutral-200 rounded shadow-lg overflow-hidden' },
        React.createElement(
          CardHeader,
          null,
          React.createElement(CardTitle, null, 'Register Enterprise User')
        ),
        React.createElement(
          CardContent,
          { className: 'p-6' },
          React.createElement(
            'form',
            { onSubmit: handleAddUser, className: 'space-y-4' },
            React.createElement(
              'div',
              { className: 'grid grid-cols-2 gap-4' },
              React.createElement(Input, {
                label: 'First Name',
                value: firstName,
                onChange: (e) => setFirstName(e.target.value),
                placeholder: 'John',
                required: true
              }),
              React.createElement(Input, {
                label: 'Last Name',
                value: lastName,
                onChange: (e) => setLastName(e.target.value),
                placeholder: 'Doe',
                required: true
              })
            ),
            React.createElement(Input, {
              label: 'Email Address',
              type: 'email',
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: 'john.doe@nexasphere.com',
              required: true
            }),
            React.createElement(Select, {
              label: 'User Role',
              value: role,
              onChange: (e) => setRole(e.target.value),
              options: [
                { value: 'Admin', label: 'Admin' },
                { value: 'Finance', label: 'Finance' },
                { value: 'Operations', label: 'Operations' },
                { value: 'Inventory', label: 'Inventory' },
                { value: 'Management', label: 'Management' },
                { value: 'PlatformAdmin', label: 'PlatformAdmin' }
              ]
            }),
            React.createElement(Select, {
              label: 'Department',
              value: department,
              onChange: (e) => setDepartment(e.target.value),
              options: [
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Finance', label: 'Finance' },
                { value: 'Operations', label: 'Operations' },
                { value: 'Logistics', label: 'Logistics' },
                { value: 'Executive', label: 'Executive' },
                { value: 'Infrastructure', label: 'Infrastructure' }
              ]
            }),
            React.createElement(
              'div',
              { className: 'flex justify-end space-x-2 pt-4 border-t border-neutral-100' },
              React.createElement(
                Button,
                { type: 'button', variant: 'outline', onClick: () => setShowAddModal(false) },
                'Cancel'
              ),
              React.createElement(
                Button,
                { type: 'submit', variant: 'primary' },
                'Register User'
              )
            )
          )
        )
      )
    )
  );
}
