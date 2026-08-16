import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle, Loader2 } from 'lucide-react';
import { cn } from './utils';

// --- BUTTON ---
export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  children, 
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-500',
    outline: 'border border-neutral-200 bg-transparent hover:bg-neutral-50 text-neutral-700 focus:ring-neutral-500',
    ghost: 'bg-transparent hover:bg-neutral-50 text-neutral-700 focus:ring-neutral-500',
    danger: 'bg-error-500 hover:bg-error-600 text-white focus:ring-error-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };
  
  return React.createElement(
    'button',
    {
      ref,
      disabled: disabled || loading,
      className: cn(baseStyles, variants[variant], sizes[size], className),
      ...props
    },
    loading && React.createElement(Loader2, { className: 'mr-2 h-4 w-4 animate-spin' }),
    children
  );
});
Button.displayName = 'Button';

// --- INPUT ---
export const Input = React.forwardRef(({ 
  className, 
  label, 
  error, 
  type = 'text', 
  ...props 
}, ref) => {
  return React.createElement(
    'div',
    { className: 'w-full mb-4' },
    label && React.createElement('label', { className: 'block text-xs font-semibold text-neutral-700 mb-1' }, label),
    React.createElement('input', {
      ref,
      type,
      className: cn(
        'w-full px-3 py-2 text-sm bg-white border rounded border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
        error && 'border-error-500 focus:ring-error-500 focus:border-error-500',
        className
      ),
      ...props
    }),
    error && React.createElement('p', { className: 'mt-1 text-xs text-error-500' }, error)
  );
});
Input.displayName = 'Input';

// --- SELECT ---
export const Select = React.forwardRef(({ 
  className, 
  label, 
  error, 
  options = [], 
  ...props 
}, ref) => {
  return React.createElement(
    'div',
    { className: 'w-full mb-4' },
    label && React.createElement('label', { className: 'block text-xs font-semibold text-neutral-700 mb-1' }, label),
    React.createElement(
      'select',
      {
        ref,
        className: cn(
          'w-full px-3 py-2 text-sm bg-white border rounded border-neutral-200 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500',
          error && 'border-error-500 focus:ring-error-500 focus:border-error-500',
          className
        ),
        ...props
      },
      options.map(opt => React.createElement('option', { key: opt.value, value: opt.value }, opt.label))
    ),
    error && React.createElement('p', { className: 'mt-1 text-xs text-error-500' }, error)
  );
});
Select.displayName = 'Select';

// --- CARD ---
export const Card = ({ className, children, ...props }) => {
  return React.createElement('div', {
    className: cn('bg-white border border-neutral-200 rounded shadow-sm overflow-hidden', className),
    ...props
  }, children);
};

export const CardHeader = ({ className, children, ...props }) => {
  return React.createElement('div', {
    className: cn('px-4 py-3 border-b border-neutral-100 bg-neutral-50', className),
    ...props
  }, children);
};

export const CardTitle = ({ className, children, ...props }) => {
  return React.createElement('h3', {
    className: cn('text-sm font-semibold text-neutral-900', className),
    ...props
  }, children);
};

export const CardContent = ({ className, children, ...props }) => {
  return React.createElement('div', {
    className: cn('p-4', className),
    ...props
  }, children);
};

export const CardFooter = ({ className, children, ...props }) => {
  return React.createElement('div', {
    className: cn('px-4 py-3 border-t border-neutral-100 bg-neutral-50', className),
    ...props
  }, children);
};

// --- BADGE ---
export const Badge = ({ className, variant = 'neutral', children, ...props }) => {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold';
  
  const variants = {
    neutral: 'bg-neutral-100 text-neutral-700',
    primary: 'bg-primary-50 text-primary-500',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
    error: 'bg-red-50 text-red-700',
  };
  
  return React.createElement('span', {
    className: cn(baseStyles, variants[variant], className),
    ...props
  }, children);
};

// --- TABLE ---
export const Table = ({ className, children, ...props }) => {
  return React.createElement('div', { className: 'w-full overflow-x-auto border border-neutral-200 rounded' },
    React.createElement('table', {
      className: cn('w-full border-collapse text-left text-sm text-neutral-700', className),
      ...props
    }, children)
  );
};

export const TableHeader = ({ className, children, ...props }) => {
  return React.createElement('thead', {
    className: cn('bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-900', className),
    ...props
  }, children);
};

export const TableBody = ({ className, children, ...props }) => {
  return React.createElement('tbody', {
    className: cn('divide-y divide-neutral-100', className),
    ...props
  }, children);
};

export const TableRow = ({ className, children, ...props }) => {
  return React.createElement('tr', {
    className: cn('hover:bg-neutral-50 transition-colors', className),
    ...props
  }, children);
};

export const TableCell = ({ className, children, ...props }) => {
  return React.createElement('td', {
    className: cn('px-4 py-2.5', className),
    ...props
  }, children);
};

export const TableHeadCell = ({ className, children, ...props }) => {
  return React.createElement('th', {
    className: cn('px-4 py-2.5 font-semibold text-neutral-700', className),
    ...props
  }, children);
};

// --- SKELETON ---
export const Skeleton = ({ className, ...props }) => {
  return React.createElement('div', {
    className: cn('animate-pulse bg-neutral-200 rounded', className),
    ...props
  });
};

// --- ALERT (FOR FAILURE AND DOMAIN ERRORS) ---
export const Alert = ({ 
  className, 
  variant = 'info', 
  title, 
  children, 
  action, 
  ...props 
}) => {
  const icons = {
    info: React.createElement(Info, { className: 'h-5 w-5 text-secondary-500' }),
    success: React.createElement(CheckCircle, { className: 'h-5 w-5 text-success-500' }),
    warning: React.createElement(AlertTriangle, { className: 'h-5 w-5 text-warning-500' }),
    error: React.createElement(XCircle, { className: 'h-5 w-5 text-error-500' }),
  };
  
  const borderStyles = {
    info: 'border-secondary-500 bg-blue-50/50',
    success: 'border-success-500 bg-green-50/50',
    warning: 'border-warning-500 bg-amber-50/50',
    error: 'border-error-500 bg-red-50/50',
  };
  
  return React.createElement(
    'div',
    {
      className: cn('flex border-l-4 p-4 rounded', borderStyles[variant], className),
      ...props
    },
    React.createElement('div', { className: 'flex-shrink-0 mr-3' }, icons[variant]),
    React.createElement(
      'div',
      { className: 'flex-1' },
      title && React.createElement('h5', { className: 'text-sm font-semibold text-neutral-900 mb-1' }, title),
      React.createElement('div', { className: 'text-sm text-neutral-700' }, children)
    ),
    action && React.createElement('div', { className: 'flex-shrink-0 ml-3' }, action)
  );
};

// --- LOADER SPIN ---
export const Spinner = ({ className, ...props }) => {
  return React.createElement(Loader2, {
    className: cn('h-6 w-6 animate-spin text-primary-500', className),
    ...props
  });
};
