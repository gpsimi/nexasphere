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
      {
        source: '/dashboard/:path*',
        destination: 'http://localhost:3001/dashboard/:path*'
      },
      {
        source: '/users/:path*',
        destination: 'http://localhost:3002/users/:path*'
      },
      {
        source: '/finance/:path*',
        destination: 'http://localhost:3003/finance/:path*'
      },
      {
        source: '/operations/:path*',
        destination: 'http://localhost:3004/operations/:path*'
      },
      {
        source: '/inventory/:path*',
        destination: 'http://localhost:3005/inventory/:path*'
      },
      {
        source: '/reports/:path*',
        destination: 'http://localhost:3006/reports/:path*'
      },
      {
        source: '/analytics/:path*',
        destination: 'http://localhost:3007/analytics/:path*'
      },
      {
        source: '/system-health/:path*',
        destination: 'http://localhost:3008/system-health/:path*'
      }
    ];
  }
};
