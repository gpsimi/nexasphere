export type UserRole = 'Admin' | 'Finance' | 'Operations' | 'Inventory' | 'Management' | 'PlatformAdmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  amount: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  date: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  availableUnits: number;
  reorderLevel: number;
  status: 'Healthy' | 'Low Stock' | 'Critical' | 'Out of Stock';
}

export interface Transaction {
  id: string;
  reference: string;
  date: string;
  customerId: string;
  customerName: string;
  amount: number;
  type: 'Income' | 'Expense';
  paymentMethod: 'Bank Transfer' | 'Card' | 'Cash' | 'USSD';
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'Success' | 'Warning' | 'Error' | 'Information';
  timestamp: string;
  read: boolean;
}

export type ModuleStatus = 'Healthy' | 'Unavailable';

export interface SystemStatus {
  shell: ModuleStatus;
  dashboard: ModuleStatus;
  users: ModuleStatus;
  finance: ModuleStatus;
  operations: ModuleStatus;
  inventory: ModuleStatus;
  reports: ModuleStatus;
  analytics: ModuleStatus;
  apiGateway: ModuleStatus;
  database: ModuleStatus;
  authentication: ModuleStatus;
}
