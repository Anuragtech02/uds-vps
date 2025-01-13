import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

const validRoutes = [
   'about-us',
   'blogs',
   'cart',
   'checkout',
   'contact-us',
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
   'disclaimer',
   'legal',
   'not-found',
   'company-profile',
   'custom-research',
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
   images: {
      domains: ['udsweb.s3.ap-south-1.amazonaws.com'],
   },
   async redirects() {
      return [
         // Handle invalid paths for valid locales (exclude product-tag from invalid paths)
         {
            source:
               '/:locale(' +
               SUPPORTED_LOCALES.join('|') +
               ')/:invalidPath((?!not-found|product-tag|' +
               validRoutes.join('|') +
               '|' +
               validRoutes.map((route) => `${route}/.*`).join('|') +
               ').*)',
            destination: '/:locale/not-found',
            permanent: false,
         },
         // Handle completely invalid paths (including invalid locales, but exclude product-tag)
         {
            source:
               '/:invalidPath((?!_next|api|favicon.ico|reports?|product-tag|not-found|$|' +
               SUPPORTED_LOCALES.join('|') +
               '|' +
               validRoutes.join('|') +
               '|' +
               validRoutes.map((route) => `${route}/.*`).join('|') +
               ').*)',
            destination: '/en/not-found',
            permanent: false,
         },
         {
            source: '/reports/industry/:path*',
            destination: '/reports?industries=:path*',
            permanent: true,
         },
         {
            source: '/:locale/reports/industry/:path*',
            destination: '/:locale/reports?industries=:path*',
            permanent: true,
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
         {
            source: '/custom-research',
            destination: '/services',
            permanent: true,
         },
         {
            source: '/:locale/custom-research',
            destination: '/:locale/services',
            permanent: true,
         },
         {
            source: '/company-profile/:path*',
            destination: '/',
            permanent: true,
         },
         {
            source: '/:locale/company-profile/:path*',
            destination: '/:locale/',
            permanent: true,
         },
      ];
   },
};

if (process.env.NODE_ENV === 'development') {
   await setupDevPlatform();
}

export default nextConfig;
