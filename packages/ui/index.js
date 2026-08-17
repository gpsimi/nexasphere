import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle, Loader2, X, ChevronDown } from 'lucide-react';
import { cn } from './utils';

// ==========================================
// BUTTON
// ==========================================
export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  icon: Icon,
  children, 
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer';
  
  const variants = {
    primary: 'bg-primary-700 hover:bg-primary-600 text-white shadow-sm hover:shadow focus:ring-primary-500 border border-primary-800',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white shadow-sm hover:shadow focus:ring-secondary-500 border border-secondary-600',
    outline: 'border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 shadow-xs focus:ring-primary-500',
    ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-700 focus:ring-neutral-500',
    danger: 'bg-error-500 hover:bg-error-600 text-white shadow-sm focus:ring-error-500 border border-error-600',
    success: 'bg-success-500 hover:bg-success-600 text-white shadow-sm focus:ring-success-500 border border-success-600',
  };
  
  const sizes = {
    xs: 'px-2.5 py-1 text-xs gap-1.5',
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };
  
  return React.createElement(
    'button',
    {
      ref,
      disabled: disabled || loading,
      className: cn(baseStyles, variants[variant] || variants.primary, sizes[size] || sizes.md, className),
      ...props
    },
    loading ? React.createElement(Loader2, { className: 'h-4 w-4 animate-spin' }) : (Icon && React.createElement(Icon, { className: 'h-4 w-4' })),
    children
  );
});
Button.displayName = 'Button';

// ==========================================
// INPUT
// ==========================================
export const Input = React.forwardRef(({ 
  className, 
  label, 
  hint,
  error, 
  icon: Icon,
  type = 'text', 
  ...props 
}, ref) => {
  return React.createElement(
    'div',
    { className: 'w-full mb-3' },
    label && React.createElement(
      'label', 
      { className: 'block text-xs font-semibold text-neutral-700 mb-1.5' }, 
      label
    ),
    React.createElement(
      'div',
      { className: 'relative flex items-center' },
      Icon && React.createElement(Icon, { className: 'absolute left-3 h-4 w-4 text-neutral-400 pointer-events-none' }),
      React.createElement('input', {
        ref,
        type,
        className: cn(
          'w-full px-3.5 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 shadow-xs',
          Icon && 'pl-9',
          error && 'border-error-500 focus:ring-error-500/20 focus:border-error-500',
          className
        ),
        ...props
      })
    ),
    hint && !error && React.createElement('p', { className: 'mt-1 text-xs text-neutral-500' }, hint),
    error && React.createElement('p', { className: 'mt-1 text-xs text-error-500 font-medium' }, error)
  );
});
Input.displayName = 'Input';

// ==========================================
// SELECT
// ==========================================
export const Select = React.forwardRef(({ 
  className, 
  label, 
  error, 
  options = [], 
  ...props 
}, ref) => {
  return React.createElement(
    'div',
    { className: 'w-full mb-3' },
    label && React.createElement('label', { className: 'block text-xs font-semibold text-neutral-700 mb-1.5' }, label),
    React.createElement(
      'div',
      { className: 'relative flex items-center' },
      React.createElement(
        'select',
        {
          ref,
          className: cn(
            'w-full appearance-none px-3.5 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 shadow-xs cursor-pointer pr-9',
            error && 'border-error-500 focus:ring-error-500/20 focus:border-error-500',
            className
          ),
          ...props
        },
        options.map(opt => React.createElement('option', { key: opt.value, value: opt.value }, opt.label))
      ),
      React.createElement(ChevronDown, { className: 'absolute right-3 h-4 w-4 text-neutral-400 pointer-events-none' })
    ),
    error && React.createElement('p', { className: 'mt-1 text-xs text-error-500 font-medium' }, error)
  );
});
Select.displayName = 'Select';

// ==========================================
// CARD
// ==========================================
export const Card = ({ className, children, ...props }) => {
  return React.createElement('div', {
    className: cn('bg-white border border-neutral-200/80 rounded-xl shadow-card transition-all duration-150', className),
    ...props
  }, children);
};

export const CardHeader = ({ className, children, ...props }) => {
  return React.createElement('div', {
    className: cn('px-5 py-4 border-b border-neutral-100 flex items-center justify-between', className),
    ...props
  }, children);
};

export const CardTitle = ({ className, children, ...props }) => {
  return React.createElement('h3', {
    className: cn('text-sm font-bold text-neutral-900 tracking-tight', className),
    ...props
  }, children);
};

export const CardDescription = ({ className, children, ...props }) => {
  return React.createElement('p', {
    className: cn('text-xs text-neutral-500 mt-0.5', className),
    ...props
  }, children);
};

export const CardContent = ({ className, children, ...props }) => {
  return React.createElement('div', {
    className: cn('p-5', className),
    ...props
  }, children);
};

export const CardFooter = ({ className, children, ...props }) => {
  return React.createElement('div', {
    className: cn('px-5 py-3.5 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between rounded-b-xl', className),
    ...props
  }, children);
};

// ==========================================
// BADGE
// ==========================================
export const Badge = ({ className, variant = 'neutral', dot = false, children, ...props }) => {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold';
  
  const variants = {
    neutral: 'bg-neutral-100 text-neutral-700 border border-neutral-200/60',
    primary: 'bg-primary-50 text-primary-700 border border-primary-200/60',
    secondary: 'bg-secondary-50 text-secondary-700 border border-secondary-200/60',
    success: 'bg-success-50 text-success-700 border border-success-200/60',
    warning: 'bg-warning-50 text-warning-700 border border-warning-200/60',
    error: 'bg-error-50 text-error-700 border border-error-200/60',
  };

  const dotColors = {
    neutral: 'bg-neutral-500',
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
  };
  
  return React.createElement(
    'span', 
    {
      className: cn(baseStyles, variants[variant] || variants.neutral, className),
      ...props
    },
    dot && React.createElement('span', { className: cn('h-1.5 w-1.5 rounded-full', dotColors[variant] || dotColors.neutral) }),
    children
  );
};

// ==========================================
// STATUS DOT
// ==========================================
export const StatusDot = ({ status = 'online', className }) => {
  const isOnline = status === 'online' || status === 'healthy';
  return React.createElement(
    'span',
    { className: cn('relative flex h-2.5 w-2.5', className) },
    isOnline && React.createElement('span', { className: 'animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75' }),
    React.createElement('span', { className: cn('relative inline-flex rounded-full h-2.5 w-2.5', isOnline ? 'bg-success-500' : 'bg-error-500') })
  );
};

// ==========================================
// TABLE
// ==========================================
export const Table = ({ className, children, ...props }) => {
  return React.createElement(
    'div', 
    { className: 'w-full overflow-x-auto border border-neutral-200/80 rounded-xl bg-white shadow-card' },
    React.createElement('table', {
      className: cn('w-full border-collapse text-left text-sm text-neutral-700', className),
      ...props
    }, children)
  );
};

export const TableHeader = ({ className, children, ...props }) => {
  return React.createElement('thead', {
    className: cn('bg-neutral-50 border-b border-neutral-200/80 font-semibold text-neutral-900 text-xs uppercase tracking-wider', className),
    ...props
  }, children);
};

export const TableBody = ({ className, children, ...props }) => {
  return React.createElement('tbody', {
    className: cn('divide-y divide-neutral-100', className),
    ...props
  }, children);
};

export const TableRow = ({ className, active = false, children, ...props }) => {
  return React.createElement('tr', {
    className: cn(
      'hover:bg-neutral-50/80 transition-colors',
      active && 'bg-secondary-50/30',
      className
    ),
    ...props
  }, children);
};

export const TableCell = ({ className, children, ...props }) => {
  return React.createElement('td', {
    className: cn('px-5 py-3.5 text-neutral-700 align-middle', className),
    ...props
  }, children);
};

export const TableHeadCell = ({ className, children, ...props }) => {
  return React.createElement('th', {
    className: cn('px-5 py-3 font-semibold text-neutral-600 align-middle', className),
    ...props
  }, children);
};

// ==========================================
// SKELETON
// ==========================================
export const Skeleton = ({ className, ...props }) => {
  return React.createElement('div', {
    className: cn('animate-pulse bg-neutral-200/80 rounded-lg', className),
    ...props
  });
};

// ==========================================
// AVATAR
// ==========================================
export const Avatar = ({ name = 'User', role, size = 'md', className }) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizes = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-11 w-11 text-base',
  };

  return React.createElement(
    'div',
    {
      className: cn(
        'rounded-full bg-gradient-to-tr from-primary-700 to-secondary-600 text-white flex items-center justify-center font-bold shadow-xs select-none',
        sizes[size] || sizes.md,
        className
      )
    },
    initials
  );
};

// ==========================================
// ALERT
// ==========================================
export const Alert = ({ 
  className, 
  variant = 'info', 
  title, 
  children, 
  action, 
  onClose,
  ...props 
}) => {
  const icons = {
    info: React.createElement(Info, { className: 'h-5 w-5 text-secondary-500' }),
    success: React.createElement(CheckCircle, { className: 'h-5 w-5 text-success-500' }),
    warning: React.createElement(AlertTriangle, { className: 'h-5 w-5 text-warning-500' }),
    error: React.createElement(XCircle, { className: 'h-5 w-5 text-error-500' }),
  };
  
  const styles = {
    info: 'border-secondary-200 bg-secondary-50 text-secondary-900',
    success: 'border-success-200 bg-success-50 text-success-900',
    warning: 'border-warning-200 bg-warning-50 text-warning-900',
    error: 'border-error-200 bg-error-50 text-error-900',
  };
  
  return React.createElement(
    'div',
    {
      className: cn('flex items-start border p-4 rounded-xl shadow-xs gap-3', styles[variant] || styles.info, className),
      ...props
    },
    React.createElement('div', { className: 'flex-shrink-0 mt-0.5' }, icons[variant]),
    React.createElement(
      'div',
      { className: 'flex-1 min-w-0' },
      title && React.createElement('h5', { className: 'text-sm font-bold mb-0.5' }, title),
      React.createElement('div', { className: 'text-sm opacity-90 leading-relaxed' }, children)
    ),
    action && React.createElement('div', { className: 'flex-shrink-0 ml-2' }, action),
    onClose && React.createElement(
      'button',
      {
        onClick: onClose,
        className: 'flex-shrink-0 p-1 hover:opacity-75 rounded transition-opacity cursor-pointer'
      },
      React.createElement(X, { className: 'h-4 w-4' })
    )
  );
};

// ==========================================
// MODAL / DIALOG
// ==========================================
export const Modal = ({ isOpen, onClose, title, description, children, footer, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return React.createElement(
    'div',
    { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200' },
    React.createElement(
      'div',
      { className: cn('bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full overflow-hidden animate-in zoom-in-95 duration-200', maxWidth) },
      React.createElement(
        'div',
        { className: 'px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50' },
        React.createElement(
          'div',
          null,
          React.createElement('h3', { className: 'text-base font-bold text-neutral-900' }, title),
          description && React.createElement('p', { className: 'text-xs text-neutral-500 mt-0.5' }, description)
        ),
        React.createElement(
          'button',
          {
            onClick: onClose,
            className: 'p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer'
          },
          React.createElement(X, { className: 'h-4 w-4' })
        )
      ),
      React.createElement('div', { className: 'p-6 max-h-[75vh] overflow-y-auto' }, children),
      footer && React.createElement('div', { className: 'px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end gap-3' }, footer)
    )
  );
};

// ==========================================
// SPINNER
// ==========================================
export const Spinner = ({ className, size = 'md', ...props }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };
  return React.createElement(Loader2, {
    className: cn('animate-spin text-secondary-500', sizes[size] || sizes.md, className),
    ...props
  });
};
