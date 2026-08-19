'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, CardHeader, CardTitle, CardDescription, 
  CardContent, Badge, Button, Input, Select, Modal, 
  Table, TableHeader, TableBody, TableRow, TableCell, 
  TableHeadCell, Alert, StatusDot 
} from '@nexasphere/ui';
import { 
  Package, AlertTriangle, CheckCircle2, Plus, 
  Search, RefreshCw, ShoppingCart, ArrowDown, ArrowUpRight
} from 'lucide-react';
import { apiClient, EventBus } from '@nexasphere/utils';

export default function App() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [reorderModal, setReorderModal] = useState<any>(null);
  const [reorderQty, setReorderQty] = useState('50');
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    category: 'Construction',
    stock: '100',
    reorderLevel: '20',
    unitPrice: '5000'
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/products');
      if (res.data && res.data.length > 0) {
        setProducts(res.data);
      } else {
        setProducts([
          { id: '1', name: 'Reinforced Steel Rods 16mm', sku: 'SKU-STL-001', category: 'Construction', stock: 450, reorderLevel: 100, unitPrice: 8500, status: 'Healthy' },
          { id: '2', name: 'Industrial Copper Wire 2.5mm', sku: 'SKU-CPR-002', category: 'Electrical', stock: 8, reorderLevel: 25, unitPrice: 14200, status: 'Low Stock' },
          { id: '3', name: 'Hydraulic Valve Couplings 2"', sku: 'SKU-HYD-003', category: 'Mechanical', stock: 120, reorderLevel: 30, unitPrice: 28000, status: 'Healthy' },
          { id: '4', name: 'Portland Composite Cement 50kg', sku: 'SKU-CMT-004', category: 'Construction', stock: 1200, reorderLevel: 200, unitPrice: 6200, status: 'Healthy' }
        ]);
      }
    } catch (err) {
      setProducts([
        { id: '1', name: 'Reinforced Steel Rods 16mm', sku: 'SKU-STL-001', category: 'Construction', stock: 450, reorderLevel: 100, unitPrice: 8500, status: 'Healthy' },
        { id: '2', name: 'Industrial Copper Wire 2.5mm', sku: 'SKU-CPR-002', category: 'Electrical', stock: 8, reorderLevel: 25, unitPrice: 14200, status: 'Low Stock' },
        { id: '3', name: 'Hydraulic Valve Couplings 2"', sku: 'SKU-HYD-003', category: 'Mechanical', stock: 120, reorderLevel: 30, unitPrice: 28000, status: 'Healthy' },
        { id: '4', name: 'Portland Composite Cement 50kg', sku: 'SKU-CMT-004', category: 'Construction', stock: 1200, reorderLevel: 200, unitPrice: 6200, status: 'Healthy' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleReorder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reorderModal) return;

    const qty = parseInt(reorderQty, 10);
    try {
      await apiClient.post(`/products/${reorderModal.id}/reorder`, { quantity: qty });
    } catch (e) {
      // offline fallback
    }

    setProducts(prev => prev.map(p => {
      if (p.id === reorderModal.id) {
        const nextStock = p.stock + qty;
        return {
          ...p,
          stock: nextStock,
          status: nextStock > p.reorderLevel ? 'Healthy' : 'Low Stock'
        };
      }
      return p;
    }));

    EventBus.publish('NOTIFICATION_RECEIVED', {
      message: `Stock requisition sent: +${qty} units of ${reorderModal.name}`,
      type: 'Success'
    });

    setReorderModal(null);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.sku) return;

    const newProd = {
      id: Date.now().toString(),
      name: productForm.name,
      sku: productForm.sku,
      category: productForm.category,
      stock: parseInt(productForm.stock, 10) || 0,
      reorderLevel: parseInt(productForm.reorderLevel, 10) || 10,
      unitPrice: parseFloat(productForm.unitPrice) || 0,
      status: (parseInt(productForm.stock, 10) || 0) > (parseInt(productForm.reorderLevel, 10) || 10) ? 'Healthy' : 'Low Stock'
    };

    setProducts(prev => [newProd, ...prev]);
    setAddProductOpen(false);
    setProductForm({
      name: '',
      sku: '',
      category: 'Construction',
      stock: '100',
      reorderLevel: '20',
      unitPrice: '5000'
    });

    EventBus.publish('NOTIFICATION_RECEIVED', {
      message: `Product added to catalog: ${newProd.name} (${newProd.sku})`,
      type: 'Success'
    });
  };

  const lowStockItems = products.filter(p => p.stock <= p.reorderLevel);
  const totalValuation = products.reduce((acc, p) => acc + (p.stock * p.unitPrice), 0);

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
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
        React.createElement('h1', { className: 'text-2xl font-extrabold text-neutral-900 tracking-tight' }, 'Inventory & Warehouse Stock Control'),
        React.createElement('p', { className: 'text-xs text-neutral-500' }, 'Real-time stock level monitoring, automated replenishment, and product valuation.')
      ),
      React.createElement(
        'div',
        { className: 'flex items-center space-x-3' },
        React.createElement(Button, { variant: 'outline', size: 'sm', onClick: fetchProducts, icon: RefreshCw }, 'Refresh'),
        React.createElement(Button, { variant: 'primary', size: 'sm', onClick: () => setAddProductOpen(true), icon: Plus }, 'Add Product')
      )
    ),

    // Low Stock Alert Banner
    lowStockItems.length > 0 && React.createElement(
      Alert,
      {
        variant: 'warning',
        title: `${lowStockItems.length} Product Requires Immediate Replenishment`,
        action: React.createElement(
          Button,
          {
            variant: 'secondary',
            size: 'xs',
            onClick: () => {
              setReorderModal(lowStockItems[0]);
              setReorderQty('50');
            }
          },
          'Reorder Now'
        )
      },
      `"${lowStockItems[0].name}" has fallen to ${lowStockItems[0].stock} units (Threshold: ${lowStockItems[0].reorderLevel} units).`
    ),

    // Inventory Metrics Grid
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
      [
        { label: 'Catalog SKU Count', value: products.length, icon: Package, color: 'text-blue-600 bg-blue-50' },
        { label: 'Total Valuation', value: `₦${(totalValuation / 1000000).toFixed(2)}M`, icon: ArrowUpRight, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Low Stock Alerts', value: lowStockItems.length, icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
        { label: 'Warehouse Capacity', value: '78.4%', icon: CheckCircle2, color: 'text-indigo-600 bg-indigo-50' }
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

    // Main Catalog Table
    React.createElement(
      Card,
      null,
      React.createElement(
        'div',
        { className: 'p-4 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-neutral-50/50' },
        React.createElement(Input, {
          placeholder: 'Search product name or SKU...',
          icon: Search,
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: 'mb-0 w-full md:w-80'
        }),
        React.createElement(
          'select',
          {
            value: categoryFilter,
            onChange: (e) => setCategoryFilter(e.target.value),
            className: 'px-3 py-2 text-xs font-semibold bg-white border border-neutral-300 rounded-lg text-neutral-700 focus:outline-none focus:ring-2 focus:ring-secondary-500/20'
          },
          React.createElement('option', { value: 'ALL' }, 'All Categories'),
          React.createElement('option', { value: 'Construction' }, 'Construction'),
          React.createElement('option', { value: 'Electrical' }, 'Electrical'),
          React.createElement('option', { value: 'Mechanical' }, 'Mechanical')
        )
      ),

      React.createElement(
        Table,
        { className: 'border-0 rounded-none shadow-none' },
        React.createElement(
          TableHeader,
          null,
          React.createElement(
            TableRow,
            null,
            React.createElement(TableHeadCell, null, 'Product & SKU'),
            React.createElement(TableHeadCell, null, 'Category'),
            React.createElement(TableHeadCell, null, 'Stock Units'),
            React.createElement(TableHeadCell, null, 'Unit Price'),
            React.createElement(TableHeadCell, null, 'Asset Valuation'),
            React.createElement(TableHeadCell, null, 'Status'),
            React.createElement(TableHeadCell, { className: 'text-right' }, 'Action')
          )
        ),
        React.createElement(
          TableBody,
          null,
          filtered.map(p => React.createElement(
            TableRow,
            { key: p.id },
            React.createElement(
              TableCell,
              null,
              React.createElement('span', { className: 'font-bold text-neutral-900 block text-xs' }, p.name),
              React.createElement('span', { className: 'font-mono text-[10px] text-neutral-400' }, p.sku)
            ),
            React.createElement(TableCell, null, React.createElement(Badge, { variant: 'neutral' }, p.category)),
            React.createElement(
              TableCell,
              null,
              React.createElement(
                'div',
                { className: 'flex items-center space-x-2' },
                React.createElement('span', { className: `font-bold text-xs ${p.stock <= p.reorderLevel ? 'text-rose-600 font-extrabold' : 'text-neutral-800'}` }, `${p.stock} units`),
                p.stock <= p.reorderLevel && React.createElement(AlertTriangle, { className: 'h-3.5 w-3.5 text-amber-500' })
              )
            ),
            React.createElement(TableCell, null, React.createElement('span', { className: 'text-xs text-neutral-700 font-medium' }, `₦${p.unitPrice.toLocaleString()}`)),
            React.createElement(TableCell, null, React.createElement('span', { className: 'text-xs font-bold text-neutral-900' }, `₦${(p.stock * p.unitPrice).toLocaleString()}`)),
            React.createElement(
              TableCell,
              null,
              React.createElement(
                Badge,
                {
                  variant: p.status === 'Healthy' ? 'success' : 'warning',
                  dot: true
                },
                p.status
              )
            ),
            React.createElement(
              TableCell,
              { className: 'text-right' },
              React.createElement(
                Button,
                {
                  variant: p.stock <= p.reorderLevel ? 'secondary' : 'outline',
                  size: 'xs',
                  icon: ShoppingCart,
                  onClick: () => {
                    setReorderModal(p);
                    setReorderQty('50');
                  }
                },
                'Reorder'
              )
            )
          ))
        )
      )
    ),

    // Reorder Stock Modal
    React.createElement(
      Modal,
      {
        isOpen: !!reorderModal,
        onClose: () => setReorderModal(null),
        title: `Reorder Stock: ${reorderModal?.name || ''}`,
        description: `Current Stock: ${reorderModal?.stock || 0} units | Reorder Threshold: ${reorderModal?.reorderLevel || 0} units`
      },
      React.createElement(
        'form',
        { onSubmit: handleReorder, className: 'space-y-4' },
        React.createElement(Input, {
          label: 'Replenishment Quantity (Units)',
          type: 'number',
          value: reorderQty,
          onChange: (e) => setReorderQty(e.target.value),
          required: true,
          min: '1'
        }),
        React.createElement(
          'div',
          { className: 'p-3 bg-neutral-50 rounded-lg text-xs space-y-1 text-neutral-600' },
          React.createElement('div', { className: 'flex justify-between' }, React.createElement('span', null, 'Unit Cost:'), React.createElement('span', { className: 'font-bold' }, `₦${reorderModal?.unitPrice.toLocaleString()}`)),
          React.createElement('div', { className: 'flex justify-between' }, React.createElement('span', null, 'Estimated Total Reorder Cost:'), React.createElement('span', { className: 'font-bold text-neutral-900' }, `₦${((parseInt(reorderQty, 10) || 0) * (reorderModal?.unitPrice || 0)).toLocaleString()}`))
        ),
        React.createElement(
          'div',
          { className: 'flex justify-end space-x-3 pt-4 border-t border-neutral-100' },
          React.createElement(Button, { type: 'button', variant: 'outline', onClick: () => setReorderModal(null) }, 'Cancel'),
          React.createElement(Button, { type: 'submit', variant: 'primary' }, 'Confirm Purchase Order')
        )
      )
    ),

    // Add Product Modal
    React.createElement(
      Modal,
      {
        isOpen: addProductOpen,
        onClose: () => setAddProductOpen(false),
        title: 'Register New Product in Catalog',
        description: 'Add a new inventory SKU with automated reorder thresholds'
      },
      React.createElement(
        'form',
        { onSubmit: handleAddProduct, className: 'space-y-4' },
        React.createElement(Input, {
          label: 'Product Name',
          placeholder: 'e.g. Industrial Aluminum Profiles',
          value: productForm.name,
          onChange: (e) => setProductForm({ ...productForm, name: e.target.value }),
          required: true
        }),
        React.createElement(Input, {
          label: 'SKU Identifier',
          placeholder: 'e.g. SKU-ALU-005',
          value: productForm.sku,
          onChange: (e) => setProductForm({ ...productForm, sku: e.target.value }),
          required: true
        }),
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 gap-3' },
          React.createElement(Input, {
            label: 'Initial Stock (Units)',
            type: 'number',
            value: productForm.stock,
            onChange: (e) => setProductForm({ ...productForm, stock: e.target.value }),
            required: true
          }),
          React.createElement(Input, {
            label: 'Reorder Level Threshold',
            type: 'number',
            value: productForm.reorderLevel,
            onChange: (e) => setProductForm({ ...productForm, reorderLevel: e.target.value }),
            required: true
          })
        ),
        React.createElement(Input, {
          label: 'Unit Price (₦)',
          type: 'number',
          value: productForm.unitPrice,
          onChange: (e) => setProductForm({ ...productForm, unitPrice: e.target.value }),
          required: true
        }),
        React.createElement(
          'div',
          { className: 'flex justify-end space-x-3 pt-4 border-t border-neutral-100' },
          React.createElement(Button, { type: 'button', variant: 'outline', onClick: () => setAddProductOpen(false) }, 'Cancel'),
          React.createElement(Button, { type: 'submit', variant: 'primary' }, 'Save Product to Inventory')
        )
      )
    )
  );
}
