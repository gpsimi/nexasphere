const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding NexaSphere database...\n');

  // --- Users ---
  const users = await Promise.all([
    prisma.user.create({ data: { email: 'admin@nexasphere.com', password: 'password123', name: 'Godspower Similoluwa', role: 'Admin', department: 'Engineering', status: 'Active' } }),
    prisma.user.create({ data: { email: 'finance@nexasphere.com', password: 'password123', name: 'Kunle Adeleke', role: 'Finance', department: 'Finance', status: 'Active' } }),
    prisma.user.create({ data: { email: 'ops@nexasphere.com', password: 'password123', name: 'Tunde Bakare', role: 'Operations', department: 'Operations', status: 'Active' } }),
    prisma.user.create({ data: { email: 'stock@nexasphere.com', password: 'password123', name: 'Chinedu Okafor', role: 'Inventory', department: 'Logistics', status: 'Active' } }),
    prisma.user.create({ data: { email: 'ceo@nexasphere.com', password: 'password123', name: 'Sarah Alabi', role: 'Management', department: 'Executive', status: 'Active' } }),
    prisma.user.create({ data: { email: 'system@nexasphere.com', password: 'password123', name: 'David Smith', role: 'PlatformAdmin', department: 'Infrastructure', status: 'Active' } }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  // --- Customers ---
  const customers = await Promise.all([
    prisma.customer.create({ data: { code: 'CUST-001', name: 'Acme Logistics Ltd', region: 'Lagos', status: 'Active', balance: 145000 } }),
    prisma.customer.create({ data: { code: 'CUST-002', name: 'Halal Foods Nigeria', region: 'Kano', status: 'Active', balance: 0 } }),
    prisma.customer.create({ data: { code: 'CUST-003', name: 'Covenant University', region: 'Ogun', status: 'Active', balance: 1200000 } }),
    prisma.customer.create({ data: { code: 'CUST-004', name: 'Globals Ltd', region: 'Abuja', status: 'Active', balance: 35000 } }),
  ]);
  console.log(`✅ Created ${customers.length} customers`);

  // --- Orders ---
  const orders = await Promise.all([
    prisma.order.create({ data: { reference: 'ORD-4491', customerId: customers[0].id, amount: 75000, status: 'Pending' } }),
    prisma.order.create({ data: { reference: 'ORD-4492', customerId: customers[1].id, amount: 85000, status: 'Shipped' } }),
    prisma.order.create({ data: { reference: 'ORD-4493', customerId: customers[3].id, amount: 35000, status: 'Delivered' } }),
  ]);
  console.log(`✅ Created ${orders.length} orders`);

  // --- Products ---
  const products = await Promise.all([
    prisma.product.create({ data: { sku: 'SKU-STEEL-01', name: 'Premium Steel Pipes', description: 'SMLS steel pipes 12inch', quantity: 12, status: 'Low Stock', safetyLimit: 20 } }),
    prisma.product.create({ data: { sku: 'SKU-VALVE-99', name: 'Control Gate Valves', description: 'Threaded gate valve 2inch', quantity: 45, status: 'In Stock', safetyLimit: 15 } }),
    prisma.product.create({ data: { sku: 'SKU-CABLE-05', name: 'Copper Core Power Cable', description: 'Armored copper core cable 3core', quantity: 150, status: 'In Stock', safetyLimit: 50 } }),
    prisma.product.create({ data: { sku: 'SKU-HELMET-02', name: 'Safety Hardhats (Yellow)', description: 'ANSI industrial safety helmet', quantity: 4, status: 'Critical Low', safetyLimit: 25 } }),
  ]);
  console.log(`✅ Created ${products.length} products`);

  // --- Transactions ---
  const transactions = await Promise.all([
    prisma.transaction.create({ data: { reference: 'TXN-88092', customerId: customers[0].id, amount: 145000, type: 'Income', paymentMethod: 'Bank Transfer', status: 'Completed' } }),
    prisma.transaction.create({ data: { reference: 'TXN-88093', customerId: customers[1].id, amount: 85000, type: 'Income', paymentMethod: 'Card', status: 'Completed' } }),
    prisma.transaction.create({ data: { reference: 'TXN-88094', customerId: customers[2].id, amount: 1200000, type: 'Income', paymentMethod: 'Bank Transfer', status: 'Pending' } }),
  ]);
  console.log(`✅ Created ${transactions.length} transactions`);

  // --- Invoices ---
  const invoices = await Promise.all([
    prisma.invoice.create({ data: { invoiceNumber: 'INV-8890', customerId: customers[0].id, amount: 145000, dueDate: new Date('2026-08-30'), status: 'Paid' } }),
    prisma.invoice.create({ data: { invoiceNumber: 'INV-8891', customerId: customers[2].id, amount: 1200000, dueDate: new Date('2026-08-25'), status: 'Unpaid' } }),
    prisma.invoice.create({ data: { invoiceNumber: 'INV-8892', customerId: customers[3].id, amount: 35000, dueDate: new Date('2026-08-10'), status: 'Overdue' } }),
  ]);
  console.log(`✅ Created ${invoices.length} invoices`);

  // --- Notifications ---
  const notifications = await Promise.all([
    prisma.notification.create({ data: { message: 'System healthy. All remotes active.', type: 'Success', read: true } }),
    prisma.notification.create({ data: { message: 'Welcome to NexaSphere Enterprise Console.', type: 'Information', read: true } }),
  ]);
  console.log(`✅ Created ${notifications.length} notifications`);

  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
