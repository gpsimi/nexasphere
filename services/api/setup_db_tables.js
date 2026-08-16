require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['warn', 'error']
});

async function main() {
  console.log('🚀 Connecting to Supabase PostgreSQL...');
  await prisma.$connect();
  console.log('✅ Connected successfully to Supabase database!\n');

  console.log('📦 Creating database tables (DDL)...');

  // User table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT PRIMARY KEY,
      "email" TEXT UNIQUE NOT NULL,
      "password" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "role" TEXT NOT NULL,
      "department" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'Active',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Customer table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Customer" (
      "id" TEXT PRIMARY KEY,
      "code" TEXT UNIQUE NOT NULL,
      "name" TEXT NOT NULL,
      "region" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'Active',
      "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0
    );
  `);

  // Order table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Order" (
      "id" TEXT PRIMARY KEY,
      "reference" TEXT UNIQUE NOT NULL,
      "customerId" TEXT NOT NULL REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
      "amount" DOUBLE PRECISION NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'Pending',
      "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Product table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Product" (
      "id" TEXT PRIMARY KEY,
      "sku" TEXT UNIQUE NOT NULL,
      "name" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "quantity" INTEGER NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'In Stock',
      "safetyLimit" INTEGER NOT NULL
    );
  `);

  // Transaction table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Transaction" (
      "id" TEXT PRIMARY KEY,
      "reference" TEXT UNIQUE NOT NULL,
      "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "customerId" TEXT NOT NULL REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
      "amount" DOUBLE PRECISION NOT NULL,
      "type" TEXT NOT NULL,
      "paymentMethod" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'Completed'
    );
  `);

  // Invoice table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Invoice" (
      "id" TEXT PRIMARY KEY,
      "invoiceNumber" TEXT UNIQUE NOT NULL,
      "customerId" TEXT NOT NULL REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
      "amount" DOUBLE PRECISION NOT NULL,
      "dueDate" TIMESTAMP(3) NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'Unpaid'
    );
  `);

  // AuditLog table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "AuditLog" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
      "action" TEXT NOT NULL,
      "details" TEXT NOT NULL,
      "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Notification table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Notification" (
      "id" TEXT PRIMARY KEY,
      "message" TEXT NOT NULL,
      "type" TEXT NOT NULL DEFAULT 'Information',
      "read" BOOLEAN NOT NULL DEFAULT false,
      "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ All 8 database tables created successfully in Supabase!\n');

  console.log('🌱 Seeding initial datasets...');

  // Seed Users
  await prisma.$executeRawUnsafe(`
    INSERT INTO "User" ("id", "email", "password", "name", "role", "department", "status")
    VALUES 
      ('1', 'admin@nexasphere.com', 'password123', 'Godspower Similoluwa', 'Admin', 'Engineering', 'Active'),
      ('2', 'finance@nexasphere.com', 'password123', 'Kunle Adeleke', 'Finance', 'Finance', 'Active'),
      ('3', 'ops@nexasphere.com', 'password123', 'Tunde Bakare', 'Operations', 'Operations', 'Active'),
      ('4', 'stock@nexasphere.com', 'password123', 'Chinedu Okafor', 'Inventory', 'Logistics', 'Active'),
      ('5', 'ceo@nexasphere.com', 'password123', 'Sarah Alabi', 'Management', 'Executive', 'Active'),
      ('6', 'system@nexasphere.com', 'password123', 'David Smith', 'PlatformAdmin', 'Infrastructure', 'Active')
    ON CONFLICT ("id") DO NOTHING;
  `);
  console.log('✅ Users seeded');

  // Seed Customers
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Customer" ("id", "code", "name", "region", "status", "balance")
    VALUES
      ('1', 'CUST-001', 'Acme Logistics Ltd', 'Lagos', 'Active', 145000),
      ('2', 'CUST-002', 'Halal Foods Nigeria', 'Kano', 'Active', 0),
      ('3', 'CUST-003', 'Covenant University', 'Ogun', 'Active', 1200000),
      ('4', 'CUST-004', 'Globals Ltd', 'Abuja', 'Active', 35000)
    ON CONFLICT ("id") DO NOTHING;
  `);
  console.log('✅ Customers seeded');

  // Seed Orders
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Order" ("id", "reference", "customerId", "amount", "status")
    VALUES
      ('1', 'ORD-4491', '1', 75000, 'Pending'),
      ('2', 'ORD-4492', '2', 85000, 'Shipped'),
      ('3', 'ORD-4493', '4', 35000, 'Delivered')
    ON CONFLICT ("id") DO NOTHING;
  `);
  console.log('✅ Orders seeded');

  // Seed Products
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Product" ("id", "sku", "name", "description", "quantity", "status", "safetyLimit")
    VALUES
      ('1', 'SKU-STEEL-01', 'Premium Steel Pipes', 'SMLS steel pipes 12inch', 12, 'Low Stock', 20),
      ('2', 'SKU-VALVE-99', 'Control Gate Valves', 'Threaded gate valve 2inch', 45, 'In Stock', 15),
      ('3', 'SKU-CABLE-05', 'Copper Core Power Cable', 'Armored copper core cable 3core', 150, 'In Stock', 50),
      ('4', 'SKU-HELMET-02', 'Safety Hardhats (Yellow)', 'ANSI industrial safety helmet', 4, 'Critical Low', 25)
    ON CONFLICT ("id") DO NOTHING;
  `);
  console.log('✅ Products seeded');

  // Seed Transactions
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Transaction" ("id", "reference", "customerId", "amount", "type", "paymentMethod", "status")
    VALUES
      ('1', 'TXN-88092', '1', 145000, 'Income', 'Bank Transfer', 'Completed'),
      ('2', 'TXN-88093', '2', 85000, 'Income', 'Card', 'Completed'),
      ('3', 'TXN-88094', '3', 1200000, 'Income', 'Bank Transfer', 'Pending')
    ON CONFLICT ("id") DO NOTHING;
  `);
  console.log('✅ Transactions seeded');

  // Seed Invoices
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Invoice" ("id", "invoiceNumber", "customerId", "amount", "dueDate", "status")
    VALUES
      ('1', 'INV-8890', '1', 145000, '2026-08-30'::timestamp, 'Paid'),
      ('2', 'INV-8891', '3', 1200000, '2026-08-25'::timestamp, 'Unpaid'),
      ('3', 'INV-8892', '4', 35000, '2026-08-10'::timestamp, 'Overdue')
    ON CONFLICT ("id") DO NOTHING;
  `);
  console.log('✅ Invoices seeded');

  // Seed Notifications
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Notification" ("id", "message", "type", "read")
    VALUES
      ('1', 'System healthy. All remotes active.', 'Success', true),
      ('2', 'Welcome to NexaSphere Enterprise Console.', 'Information', true)
    ON CONFLICT ("id") DO NOTHING;
  `);
  console.log('✅ Notifications seeded\n');

  // Verify counts
  const userCount = await prisma.user.count();
  const productCount = await prisma.product.count();
  const txnCount = await prisma.transaction.count();

  console.log('📊 LIVE DATABASE VERIFICATION:');
  console.log(`- Users in DB: ${userCount}`);
  console.log(`- Products in DB: ${productCount}`);
  console.log(`- Transactions in DB: ${txnCount}`);
  console.log('\n🎉 ALL DATABASE TABLES AND SEEDS COMPLETE!');
}

main()
  .catch((e) => {
    console.error('Database setup error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
