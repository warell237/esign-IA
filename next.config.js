// ============================================
// Configuration Next.js
// ============================================

/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  // Activer le mode strict React (détecte les problèmes)
  reactStrictMode: true,

  images: {
    domains: ['hcaptcha.com'],
  },

  // Configuration PWA
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
  // Empêcher Watchpack de tenter de lister les fichiers système Windows
  webpack: (config) => {
    config.watchOptions = {
      ignored: [
        '**/pagefile.sys',
        '**/swapfile.sys',
        '**/hiberfil.sys',
        '**/DumpStack.log.tmp',
        'C:/pagefile.sys',
        'C:/swapfile.sys',
        'C:/hiberfil.sys',
        'C:/DumpStack.log.tmp',
      ],
    };
    return config;
  },
};

module.exports = withPWA(nextConfig);