module.exports = {
  assetPrefix: process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3006',
  transpilePackages: ['@nexasphere/ui', '@nexasphere/auth', '@nexasphere/utils'],
  eslint: { ignoreDuringBuilds: true },
};
