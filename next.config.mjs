import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
   // reactStrictMode: true,
   images: {
      domains: ['udsweb.s3.ap-south-1.amazonaws.com'],
   },
};

if (process.env.NODE_ENV === 'development') {
   await setupDevPlatform();
}

export default nextConfig;
