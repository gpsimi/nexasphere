module.exports = {
  transpilePackages: ['@nexasphere/ui', '@nexasphere/auth', '@nexasphere/utils'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async rewrites() {
    return [
      // --- DASHBOARD (PORT 3001) ---
      {
        source: '/dashboard/_next/:path*',
        destination: 'http://localhost:3001/_next/:path*'
      },
      {
        source: '/dashboard/:path*',
        destination: 'http://localhost:3001/dashboard/:path*'
      },

      // --- USERS (PORT 3002) ---
      {
        source: '/users/_next/:path*',
        destination: 'http://localhost:3002/_next/:path*'
      },
      {
        source: '/users/:path*',
        destination: 'http://localhost:3002/users/:path*'
      },

      // --- FINANCE (PORT 3003) ---
      {
        source: '/finance/_next/:path*',
        destination: 'http://localhost:3003/_next/:path*'
      },
      {
        source: '/finance/:path*',
        destination: 'http://localhost:3003/finance/:path*'
      },

      // --- OPERATIONS (PORT 3004) ---
      {
        source: '/operations/_next/:path*',
        destination: 'http://localhost:3004/_next/:path*'
      },
      {
        source: '/operations/:path*',
        destination: 'http://localhost:3004/operations/:path*'
      },

      // --- INVENTORY (PORT 3005) ---
      {
        source: '/inventory/_next/:path*',
        destination: 'http://localhost:3005/_next/:path*'
      },
      {
        source: '/inventory/:path*',
        destination: 'http://localhost:3005/inventory/:path*'
      },

      // --- REPORTS (PORT 3006) ---
      {
        source: '/reports/_next/:path*',
        destination: 'http://localhost:3006/_next/:path*'
      },
      {
        source: '/reports/:path*',
        destination: 'http://localhost:3006/reports/:path*'
      },

      // --- ANALYTICS (PORT 3007) ---
      {
        source: '/analytics/_next/:path*',
        destination: 'http://localhost:3007/_next/:path*'
      },
      {
        source: '/analytics/:path*',
        destination: 'http://localhost:3007/analytics/:path*'
      },

      // --- SYSTEM HEALTH (PORT 3008) ---
      {
        source: '/system-health/_next/:path*',
        destination: 'http://localhost:3008/_next/:path*'
      },
      {
        source: '/system-health/:path*',
        destination: 'http://localhost:3008/system-health/:path*'
      }
    ];
  }
};
