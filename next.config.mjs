/** @type {import('next').NextConfig} */
const nextConfig = {
   output: 'standalone',
   reactStrictMode: true,
   compress: true,
   poweredByHeader: false,
   swcMinify: true,
   experimental: {
      optimizeCss: true,
      optimizeServerReact: true,
   },
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'udsweb.s3.ap-south-1.amazonaws.com',
            pathname: '/**',
         },
         {
            protocol: 'https',
            hostname: 'univdatos-cms.s3.ap-south-1.amazonaws.com',
            pathname: '/**',
         },
         {
            protocol: 'https',
            hostname: 'd21aa2ghywi6oj.cloudfront.net',
            pathname: '/**',
         },
      ],
      unoptimized: process.env.NODE_ENV === 'production',
   },
   async headers() {
      return [
         {
            source: '/static/:path*',
            headers: [
               {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
               },
            ],
         },
      ];
   },
   async redirects() {
      return [
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
            source: '/reports/company-profile/:path*',
            destination: '/',
            permanent: true,
         },
         {
            source: '/:locale/reports/company-profile/:path*',
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
         // {
         //    source: '/category/news/:slug',
         //    destination: '/news?industries=:slug',
         //    permanent: true,
         // },
         // {
         //    source: '/:locale/category/news/:slug',
         //    destination: '/:locale/news?industries=:slug',
         //    permanent: true,
         // },
         // {
         //    source: '/category/blog/:slug',
         //    destination: '/blogs?industries=:slug',
         //    permanent: true,
         // },
         // {
         //    source: '/:locale/category/blog/:slug',
         //    destination: '/:locale/blogs?industries=:slug',
         //    permanent: true,
         // },
      ];
   },
};

// if (process.env.NODE_ENV === 'development') {
//    await setupDevPlatform();
// }

export default nextConfig;
