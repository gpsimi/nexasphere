import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}
export const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
}
export const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLSelectElement>>;

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>>;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'error';
}
export const Badge: React.FC<BadgeProps>;

export const Table: React.FC<React.HTMLAttributes<HTMLTableElement>>;
export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>>;
export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>>;
export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>>;
export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>>;
export const TableHeadCell: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>>;

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>>;

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  action?: React.ReactNode;
}
export const Alert: React.FC<AlertProps>;

export const Spinner: React.FC<React.SVGProps<SVGSVGElement>>;
