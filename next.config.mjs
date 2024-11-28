import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

const validRoutes = [
   'about',
   'blogs',
   'cart',
   'checkout',
   'contact',
   'login',
   'news',
   'payment-failure',
   'payment-success',
   'privacy-policy',
   'profile',
   'reports',
   'search',
   'services',
   'signup',
   'terms-and-conditions',
   'not-found'  // Add not-found as a valid route
];

export const SUPPORTED_LOCALES = [
  'en',
  'ru',
  'ar',
  'de',
  'fr',
  'zh-TW',
  'ja',
  'ko',
  'vi',
  'it',
  'pl',
];

/** @type {import('next').NextConfig} */
const nextConfig = {
   // reactStrictMode: true,
   images: {
      domains: ['udsweb.s3.ap-south-1.amazonaws.com'],
   },
   async redirects() {
      return [
         // Handle invalid paths for valid locales
         {
            source: '/:locale(' + SUPPORTED_LOCALES.join('|') + ')/:invalidPath((?!not-found|' +
                     validRoutes.join('|') + '|' +
                     validRoutes.map(route => `${route}/.*`).join('|') +
                     ').*)',
            destination: '/:locale/not-found',
            permanent: false
         },
         // Handle completely invalid paths (including invalid locales)
         {
            source: '/:invalidPath((?!_next|api|favicon.ico|reports?|not-found|$|' + 
                     SUPPORTED_LOCALES.join('|') + '|' +
                     validRoutes.join('|') + '|' +
                     validRoutes.map(route => `${route}/.*`).join('|') +
                     ').*)',
            destination: '/en/not-found',
            permanent: false
         },
         {
            source: '/report/:path*',
            destination: '/reports/:path*',
            permanent: true,
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