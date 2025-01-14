import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// export const SUPPORTED_LOCALES = [
//    'en',
//    'ru',
//    'ar',
//    'de',
//    'fr',
//    'zh-TW',
//    'zh-CN',
//    'ja',
//    'ko',
//    'vi',
//    'it',
//    'pl',
// ];

/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      domains: ['udsweb.s3.ap-south-1.amazonaws.com'],
   },
   async redirects() {
      return [
         // {
         //    source: '/get-a-free-sample-form-php/:path*',
         //    has: [
         //       {
         //          type: 'query',
         //          key: 'product_id',
         //       },
         //    ],
         //    permanent: false,
         //    destination: '/reports/:path*', // This will be handled by middleware
         // },
         // {
         //    source:
         //       '/:locale(' +
         //       SUPPORTED_LOCALES.join('|') +
         //       ')/get-a-free-sample-form-php/:path*',
         //    has: [
         //       {
         //          type: 'query',
         //          key: 'product_id',
         //       },
         //    ],
         //    permanent: false,
         //    destination: '/:locale/reports/:path*', // This will be handled by middleware
         // },
         {
            source: '/reports/industry/:slug-market-research-reports',
            destination: '/reports?industries=:slug',
            permanent: true,
         },
         {
            source: '/:locale/reports/industry/:slug-market-research-reports',
            destination: '/:locale/reports?industries=:slug',
            permanent: true,
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
         {
            source: '/terms-and-condition',
            destination: '/terms-and-conditions',
            permanent: true,
         },
         {
            source: '/:locale/terms-and-condition',
            destination: '/:locale/terms-and-conditions',
            permanent: true,
         },
      ];
   },
};

if (process.env.NODE_ENV === 'development') {
   await setupDevPlatform();
}

export default nextConfig;
