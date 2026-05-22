// ============================================
// Configuration Next.js
// ============================================

/** @type {import('next').NextConfig} */
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
};

module.exports = nextConfig;