const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'nexasphere-secret-token-key-2026';

app.use(cors());
app.use(express.json());

// Initialize Prisma Client
let prisma = new PrismaClient({ log: ['warn', 'error'] });
let dbConnected = false;

async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    dbConnected = true;
    console.log('✅ Connected to Supabase PostgreSQL database.');
  } catch (e) {
    dbConnected = false;
    console.warn('⚠️ Supabase direct connection offline. Falling back to in-memory staging data.');
  }
}

checkDatabaseConnection();

// In-Memory Staging Datasets (Fallback)
let inMemoryUsers = [
  { id: '1', email: 'admin@nexasphere.com', password: 'password123', name: 'Godspower Similoluwa', role: 'Admin', department: 'Engineering', status: 'Active' },
  { id: '2', email: 'finance@nexasphere.com', password: 'password123', name: 'Kunle Adeleke', role: 'Finance', department: 'Finance', status: 'Active' },
  { id: '3', email: 'ops@nexasphere.com', password: 'password123', name: 'Tunde Bakare', role: 'Operations', department: 'Operations', status: 'Active' },
  { id: '4', email: 'stock@nexasphere.com', password: 'password123', name: 'Chinedu Okafor', role: 'Inventory', department: 'Logistics', status: 'Active' },
  { id: '5', email: 'ceo@nexasphere.com', password: 'password123', name: 'Sarah Alabi', role: 'Management', department: 'Executive', status: 'Active' },
  { id: '6', email: 'system@nexasphere.com', password: 'password123', name: 'David Smith', role: 'PlatformAdmin', department: 'Infrastructure', status: 'Active' }
];

let inMemoryCustomers = [
  { id: '1', code: 'CUST-001', name: 'Acme Logistics Ltd', region: 'Lagos', status: 'Active', balance: 145000 },
  { id: '2', code: 'CUST-002', name: 'Halal Foods Nigeria', region: 'Kano', status: 'Active', balance: 0 },
  { id: '3', code: 'CUST-003', name: 'Covenant University', region: 'Ogun', status: 'Active', balance: 1200000 },
  { id: '4', code: 'CUST-004', name: 'Globals Ltd', region: 'Abuja', status: 'Active', balance: 35000 }
];

let inMemoryOrders = [
  { id: '1', reference: 'ORD-4491', customerId: '1', amount: 75000, date: new Date().toISOString(), status: 'Pending' },
  { id: '2', reference: 'ORD-4492', customerId: '2', amount: 85000, date: new Date().toISOString(), status: 'Shipped' },
  { id: '3', reference: 'ORD-4493', customerId: '4', amount: 35000, date: new Date().toISOString(), status: 'Delivered' }
];

let inMemoryProducts = [
  { id: '1', sku: 'SKU-STEEL-01', name: 'Premium Steel Pipes', description: 'SMLS steel pipes 12inch', quantity: 12, status: 'Low Stock', safetyLimit: 20 },
  { id: '2', sku: 'SKU-VALVE-99', name: 'Control Gate Valves', description: 'Threaded gate valve 2inch', quantity: 45, status: 'In Stock', safetyLimit: 15 },
  { id: '3', sku: 'SKU-CABLE-05', name: 'Copper Core Power Cable', description: 'Armored copper core cable 3core', quantity: 150, status: 'In Stock', safetyLimit: 50 },
  { id: '4', sku: 'SKU-HELMET-02', name: 'Safety Hardhats (Yellow)', description: 'ANSI industrial safety helmet', quantity: 4, status: 'Critical Low', safetyLimit: 25 }
];

let inMemoryTransactions = [
  { id: '1', reference: 'TXN-88092', date: new Date().toISOString(), customerId: '1', amount: 145000, type: 'Income', paymentMethod: 'Bank Transfer', status: 'Completed' },
  { id: '2', reference: 'TXN-88093', date: new Date().toISOString(), customerId: '2', amount: 85000, type: 'Income', paymentMethod: 'Card', status: 'Completed' },
  { id: '3', reference: 'TXN-88094', date: new Date().toISOString(), customerId: '3', amount: 1200000, type: 'Income', paymentMethod: 'Bank Transfer', status: 'Pending' }
];

let inMemoryInvoices = [
  { id: '1', invoiceNumber: 'INV-8890', customerId: '1', amount: 145000, dueDate: '2026-08-30', status: 'Paid' },
  { id: '2', invoiceNumber: 'INV-8891', customerId: '3', amount: 1200000, dueDate: '2026-08-25', status: 'Unpaid' },
  { id: '3', invoiceNumber: 'INV-8892', customerId: '4', amount: 35000, dueDate: '2026-08-10', status: 'Overdue' }
];

// --- MIDDLEWARE FOR JWT VALIDATION ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Authentication token required.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
};

function getPermissionsForRole(role) {
  const roles = {
    Admin: ['view_dashboard', 'manage_users', 'view_finance', 'view_operations', 'view_inventory', 'view_reports', 'view_analytics', 'view_system_health'],
    Finance: ['view_dashboard', 'view_finance', 'view_reports'],
    Operations: ['view_dashboard', 'view_operations', 'view_inventory'],
    Inventory: ['view_dashboard', 'view_inventory'],
    Management: ['view_dashboard', 'view_reports', 'view_analytics'],
    PlatformAdmin: ['view_dashboard', 'view_system_health']
  };
  return roles[role] || [];
}

// --- AUTHENTICATION ROUTES ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  let user;

  if (dbConnected) {
    try {
      user = await prisma.user.findUnique({ where: { email } });
    } catch (e) {
      user = inMemoryUsers.find(u => u.email === email && u.password === password);
    }
  } else {
    user = inMemoryUsers.find(u => u.email === email && u.password === password);
  }

  if (!user || user.password !== password) {
    return res.status(400).json({ message: 'Invalid email or password.' });
  }

  if (user.status === 'Inactive') {
    return res.status(403).json({ message: 'Account suspended. Contact support.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, permissions: getPermissionsForRole(user.role) },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department
    }
  });
});

// --- USER MANAGEMENT ROUTES ---
app.get('/api/users', async (req, res) => {
  if (dbConnected) {
    try {
      const dbUsers = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, department: true, status: true, createdAt: true } });
      return res.json(dbUsers);
    } catch (e) {}
  }
  res.json(inMemoryUsers);
});

app.post('/api/users', async (req, res) => {
  const { name, email, role, department } = req.body;

  if (dbConnected) {
    try {
      const newUser = await prisma.user.create({
        data: { name, email, password: 'password123', role, department, status: 'Active' }
      });
      return res.status(201).json(newUser);
    } catch (e) {
      return res.status(400).json({ message: 'User already exists or invalid data.' });
    }
  }

  if (inMemoryUsers.some(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  const newUser = {
    id: (inMemoryUsers.length + 1).toString(),
    name,
    email,
    password: 'password123',
    role,
    department,
    status: 'Active'
  };

  inMemoryUsers.unshift(newUser);
  res.status(201).json(newUser);
});

app.put('/api/users/:id/status', async (req, res) => {
  const { id } = req.params;

  if (dbConnected) {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return res.status(404).json({ message: 'User not found.' });
      const updated = await prisma.user.update({
        where: { id },
        data: { status: user.status === 'Active' ? 'Inactive' : 'Active' }
      });
      return res.json(updated);
    } catch (e) {}
  }

  const user = inMemoryUsers.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  user.status = user.status === 'Active' ? 'Inactive' : 'Active';
  res.json(user);
});

// --- TRANSACTIONS & INVOICES ROUTES ---
app.get('/api/transactions', async (req, res) => {
  if (dbConnected) {
    try {
      const dbTxns = await prisma.transaction.findMany({ include: { customer: true }, orderBy: { date: 'desc' } });
      return res.json(dbTxns);
    } catch (e) {}
  }
  res.json(inMemoryTransactions);
});

app.post('/api/transactions', async (req, res) => {
  const { customerId, amount, type, paymentMethod } = req.body;
  const reference = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;

  if (dbConnected) {
    try {
      const newTxn = await prisma.transaction.create({
        data: { reference, customerId, amount: parseFloat(amount), type, paymentMethod, status: 'Completed' }
      });
      return res.status(201).json(newTxn);
    } catch (e) {}
  }

  const newTxn = {
    id: (inMemoryTransactions.length + 1).toString(),
    reference,
    date: new Date().toISOString(),
    customerId,
    amount,
    type,
    paymentMethod,
    status: 'Completed'
  };
  inMemoryTransactions.unshift(newTxn);
  res.status(201).json(newTxn);
});

app.get('/api/invoices', async (req, res) => {
  if (dbConnected) {
    try {
      const dbInvoices = await prisma.invoice.findMany({ include: { customer: true } });
      return res.json(dbInvoices);
    } catch (e) {}
  }
  res.json(inMemoryInvoices);
});

// --- OPERATIONS ROUTES ---
app.get('/api/customers', async (req, res) => {
  if (dbConnected) {
    try {
      const dbCustomers = await prisma.customer.findMany();
      return res.json(dbCustomers);
    } catch (e) {}
  }
  res.json(inMemoryCustomers);
});

app.get('/api/orders', async (req, res) => {
  if (dbConnected) {
    try {
      const dbOrders = await prisma.order.findMany({ include: { customer: true } });
      return res.json(dbOrders);
    } catch (e) {}
  }
  res.json(inMemoryOrders);
});

// --- INVENTORY ROUTES ---
app.get('/api/products', async (req, res) => {
  if (dbConnected) {
    try {
      const dbProducts = await prisma.product.findMany();
      return res.json(dbProducts);
    } catch (e) {}
  }
  res.json(inMemoryProducts);
});

app.post('/api/products/:id/reorder', async (req, res) => {
  const { id } = req.params;

  if (dbConnected) {
    try {
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) return res.status(404).json({ message: 'Product not found.' });
      const updated = await prisma.product.update({
        where: { id },
        data: { quantity: product.quantity + product.safetyLimit * 2, status: 'In Stock' }
      });
      return res.json(updated);
    } catch (e) {}
  }

  const product = inMemoryProducts.find(p => p.id === id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });

  product.quantity += product.safetyLimit * 2;
  product.status = 'In Stock';
  res.json(product);
});

// --- HEALTH STATUS ROUTE ---
app.get('/api/health', async (req, res) => {
  let stats = {};
  if (dbConnected) {
    try {
      const [users, products, transactions] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.transaction.count()
      ]);
      stats = { users, products, transactions };
    } catch (e) {}
  }

  res.json({
    status: 'Healthy',
    timestamp: new Date().toISOString(),
    database: {
      provider: 'Supabase PostgreSQL',
      connected: dbConnected,
      tables: ['User', 'Customer', 'Order', 'Product', 'Transaction', 'Invoice', 'AuditLog', 'Notification'],
      liveCounts: stats
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

app.listen(PORT, () => {
  console.log(`NexaSphere Enterprise API server running on port ${PORT}`);
});
