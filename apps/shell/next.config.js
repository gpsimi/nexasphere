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
      // Dashboard MFE
      {
        source: '/dashboard',
        destination: `${process.env.DASHBOARD_URL || 'http://localhost:3001'}/dashboard`
      },
      {
        source: '/dashboard/:path+',
        destination: `${process.env.DASHBOARD_URL || 'http://localhost:3001'}/dashboard/:path+`
      },

      // Users MFE
      {
        source: '/users',
        destination: `${process.env.USERS_URL || 'http://localhost:3002'}/users`
      },
      {
        source: '/users/:path+',
        destination: `${process.env.USERS_URL || 'http://localhost:3002'}/users/:path+`
      },

      // Finance MFE
      {
        source: '/finance',
        destination: `${process.env.FINANCE_URL || 'http://localhost:3003'}/finance`
      },
      {
        source: '/finance/:path+',
        destination: `${process.env.FINANCE_URL || 'http://localhost:3003'}/finance/:path+`
      },

      // Operations MFE
      {
        source: '/operations',
        destination: `${process.env.OPERATIONS_URL || 'http://localhost:3004'}/operations`
      },
      {
        source: '/operations/:path+',
        destination: `${process.env.OPERATIONS_URL || 'http://localhost:3004'}/operations/:path+`
      },

      // Inventory MFE
      {
        source: '/inventory',
        destination: `${process.env.INVENTORY_URL || 'http://localhost:3005'}/inventory`
      },
      {
        source: '/inventory/:path+',
        destination: `${process.env.INVENTORY_URL || 'http://localhost:3005'}/inventory/:path+`
      },

      // Reports MFE
      {
        source: '/reports',
        destination: `${process.env.REPORTS_URL || 'http://localhost:3006'}/reports`
      },
      {
        source: '/reports/:path+',
        destination: `${process.env.REPORTS_URL || 'http://localhost:3006'}/reports/:path+`
      },

      // Analytics MFE
      {
        source: '/analytics',
        destination: `${process.env.ANALYTICS_URL || 'http://localhost:3007'}/analytics`
      },
      {
        source: '/analytics/:path+',
        destination: `${process.env.ANALYTICS_URL || 'http://localhost:3007'}/analytics/:path+`
      },

      // System Health MFE
      {
        source: '/system-health',
        destination: `${process.env.SYSTEM_HEALTH_URL || 'http://localhost:3008'}/system-health`
      },
      {
        source: '/system-health/:path+',
        destination: `${process.env.SYSTEM_HEALTH_URL || 'http://localhost:3008'}/system-health/:path+`
      }
    ];
  }
};