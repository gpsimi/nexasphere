import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    DASHBOARD_URL: process.env.DASHBOARD_URL || 'not set',
    USERS_URL: process.env.USERS_URL || 'not set',
    FINANCE_URL: process.env.FINANCE_URL || 'not set',
    OPERATIONS_URL: process.env.OPERATIONS_URL || 'not set',
    INVENTORY_URL: process.env.INVENTORY_URL || 'not set',
    REPORTS_URL: process.env.REPORTS_URL || 'not set',
    ANALYTICS_URL: process.env.ANALYTICS_URL || 'not set',
    SYSTEM_HEALTH_URL: process.env.SYSTEM_HEALTH_URL || 'not set',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'not set',
    VERCEL_URL: process.env.VERCEL_URL || 'not set',
  });
}
