module.exports = {
  skipTrailingSlashRedirect: true,
  transpilePackages: ['@nexasphere/ui', '@nexasphere/auth', '@nexasphere/utils'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async rewrites() {
    return [
      {
        source: '/dashboard/:path*',
        destination: `${process.env.DASHBOARD_URL || 'http://localhost:3001'}/dashboard/:path*`
      },
      {
        source: '/users/:path*',
        destination: `${process.env.USERS_URL || 'http://localhost:3002'}/users/:path*`
      },
      {
        source: '/finance/:path*',
        destination: `${process.env.FINANCE_URL || 'http://localhost:3003'}/finance/:path*`
      },
      {
        source: '/operations/:path*',
        destination: `${process.env.OPERATIONS_URL || 'http://localhost:3004'}/operations/:path*`
      },
      {
        source: '/inventory/:path*',
        destination: `${process.env.INVENTORY_URL || 'http://localhost:3005'}/inventory/:path*`
      },
      {
        source: '/reports/:path*',
        destination: `${process.env.REPORTS_URL || 'http://localhost:3006'}/reports/:path*`
      },
      {
        source: '/analytics/:path*',
        destination: `${process.env.ANALYTICS_URL || 'http://localhost:3007'}/analytics/:path*`
      },
      {
        source: '/system-health/:path*',
        destination: `${process.env.SYSTEM_HEALTH_URL || 'http://localhost:3008'}/system-health/:path*`
      }
    ];
  }
};
