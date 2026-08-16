const { PrismaClient } = require('@prisma/client');

const urls = [
  "postgresql://postgres.exupeviawbnqawbiajgr:nexasphere26%23@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require&connect_timeout=30",
  "postgresql://postgres.exupeviawbnqawbiajgr:nexasphere26%23@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require&connect_timeout=30",
  "postgresql://postgres:nexasphere26%23@db.exupeviawbnqawbiajgr.supabase.co:5432/postgres?sslmode=require&connect_timeout=30",
  "postgresql://postgres.exupeviawbnqawbiajgr:nexasphere26%23@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
];

async function test() {
  for (const url of urls) {
    console.log(`\nTesting: ${url.replace(/:[^:@]+@/, ':***@')}`);
    const prisma = new PrismaClient({
      datasources: {
        db: { url }
      },
      log: ['error', 'warn']
    });
    try {
      await prisma.$connect();
      console.log('✅ Connected successfully to Supabase PostgreSQL!');
      const res = await prisma.$queryRaw`SELECT 1 as result`;
      console.log('Query result:', res);
      await prisma.$disconnect();
      return url;
    } catch (e) {
      console.log('❌ Connection failed:', e.message.split('\n')[0]);
      await prisma.$disconnect();
    }
  }
}

test();
