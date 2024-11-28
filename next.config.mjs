import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
   // reactStrictMode: true,
   images: {
      domains: ['udsweb.s3.ap-south-1.amazonaws.com'],
   },
   async redirects() {
      return [
        {
          source: '/report/:path*',
          destination: '/reports/:path*',
          permanent: true, // Set to true for 301 (permanent) redirects
        },
        {
          source: '/:locale/report/:path*',
          destination: '/:locale/reports/:path*',
          permanent: true,
        },
      ];
    },
};

if (process.env.NODE_ENV === 'development') {
   await setupDevPlatform();
}

export default nextConfig;
