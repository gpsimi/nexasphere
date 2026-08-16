'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Table, TableHeader, TableBody, TableRow, TableCell, TableHeadCell } from '@nexasphere/ui';
import { Search, Plus, AlertTriangle, Package, DollarSign } from 'lucide-react';
import { EventBus } from '@nexasphere/utils';

export default function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setProducts([
      { id: '1', sku: 'SKU-STEEL-01', name: 'Premium Steel Pipes', desc: 'SMLS steel pipes 12inch', qty: 12, status: 'Low Stock', safetyLimit: 20 },
      { id: '2', sku: 'SKU-VALVE-99', name: 'Control Gate Valves', desc: 'Threaded heavy gate valve 2inch', qty: 45, status: 'In Stock', safetyLimit: 15 },
      { id: '3', sku: 'SKU-CABLE-05', name: 'Copper Core Power Cable', desc: 'Armored copper core cable 3core', qty: 150, status: 'In Stock', safetyLimit: 50 },
      { id: '4', sku: 'SKU-HELMET-02', name: 'Safety Hardhats (Yellow)', desc: 'Industrial standard ANSI helmet', qty: 4, status: 'Critical Low', safetyLimit: 25 },
      { id: '5', sku: 'SKU-GLOVE-01', name: 'Welding Hand Gloves', desc: 'Heavy leather welding protection', qty: 82, status: 'In Stock', safetyLimit: 30 }
    ]);
  }, []);

  const handleReorder = (prodId) => {
    setProducts(prev => prev.map(p => {
      if (p.id === prodId) {
        const orderQty = p.safetyLimit * 2;
        const newQty = p.qty + orderQty;
        
        EventBus.publish('NOTIFICATION_RECEIVED', {
          message: `Stock reorder sent: SKU ${p.sku} (Quantity: +${orderQty})`,
          type: 'Success'
        });
        
        return { ...p, qty: newQty, status: 'In Stock' };
      }
      return p;
    }));
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = products.filter(p => p.qty <= p.safetyLimit).length;

  return React.createElement(
    'div',
    { className: 'space-y-6' },
    
    // Summary Cards
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
      React.createElement(
        Card,
        { className: 'p-4' },
        React.createElement('span', { className: 'text-xs text-neutral-500 font-semibold' }, 'Total SKU Entries'),
        React.createElement('h3', { className: 'text-2xl font-bold text-neutral-900 mt-1' }, products.length)
      ),
      React.createElement(
        Card,
        { className: 'p-4' },
        React.createElement('span', { className: 'text-xs text-neutral-500 font-semibold' }, 'Low Stock Warnings'),
        React.createElement('h3', { className: 'text-2xl font-bold text-amber-700 mt-1' }, lowStockCount)
      ),
      React.createElement(
        Card,
        { className: 'p-4' },
        React.createElement('span', { className: 'text-xs text-neutral-500 font-semibold' }, 'Total Stock Value'),
        React.createElement('h3', { className: 'text-2xl font-bold text-primary-700 mt-1' }, '₦18.4M')
      )
    ),

    // Product stock list table
    React.createElement(
      Card,
      null,
      React.createElement(
        CardHeader,
        { className: 'flex justify-between items-center' },
        React.createElement(CardTitle, null, 'Stock Registry'),
        React.createElement(
          'div',
          { className: 'relative max-w-xs w-64' },
          React.createElement(Search, { className: 'absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400' }),
          React.createElement('input', {
            type: 'text',
            placeholder: 'Search SKU or name...',
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
              React.createElement(TableHeadCell, null, 'SKU Code'),
              React.createElement(TableHeadCell, null, 'Product Name'),
              React.createElement(TableHeadCell, null, 'Quantity in Stock'),
              React.createElement(TableHeadCell, null, 'Safety Limit'),
              React.createElement(TableHeadCell, null, 'Status'),
              React.createElement(TableHeadCell, null, 'Actions')
            )
          ),
          React.createElement(
            TableBody,
            null,
            filteredProducts.map(p => {
              const isLow = p.qty <= p.safetyLimit;
              const isCritical = p.qty < p.safetyLimit / 2;
              
              return React.createElement(
                TableRow,
                { key: p.id },
                React.createElement(TableCell, { className: 'font-semibold' }, p.sku),
                React.createElement(
                  TableCell,
                  null,
                  React.createElement('div', { className: 'flex flex-col' },
                    React.createElement('span', { className: 'font-medium text-neutral-800 text-sm' }, p.name),
                    React.createElement('span', { className: 'text-neutral-500 text-xs' }, p.desc)
                  )
                ),
                React.createElement(TableCell, { className: 'font-bold' }, p.qty),
                React.createElement(TableCell, null, p.safetyLimit),
                React.createElement(
                  TableCell,
                  null,
                  React.createElement(
                    Badge,
                    { 
                      variant: isCritical ? 'error' : isLow ? 'warning' : 'success',
                      className: 'text-xxs px-1.5'
                    },
                    p.status
                  )
                ),
                React.createElement(
                  TableCell,
                  null,
                  isLow && React.createElement(
                    Button,
                    { variant: 'outline', size: 'sm', className: 'text-xxs px-2 py-1', onClick: () => handleReorder(p.id) },
                    'Trigger Reorder'
                  )
                )
              );
            })
          )
        )
      )
    )
  );
}
