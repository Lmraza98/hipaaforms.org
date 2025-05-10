/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add other Next.js configurations here as needed
  // For example, to enable experimental features or environment variables

  // If you plan to use tRPC with Edge runtime for some procedures, 
  // you might need to configure serverComponentsExternalPackages for Prisma
  // experimental: {
  //   serverComponentsExternalPackages: ['@prisma/client', '@/generated/prisma'], // Adjusted for generated client
  // },

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true, // Set to false if you want builds to fail on ESLint errors
    ignorePatterns: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      'src/generated/prisma/**', // Specifically ignore generated Prisma client
    ],
  }
};

export default nextConfig;
