/** @type {import('next').NextConfig} */
const nextConfig = {
   output: 'standalone',
   reactStrictMode: true,
   compress: true,
   poweredByHeader: false,
   swcMinify: true,
   trailingSlash: true,

   // Improved experimental features
   // experimental: {
   //    optimizeCss: true,
   //    optimizeServerReact: true,
   //    serverComponentsExternalPackages: ['sharp'],
   //    // Enable streaming for improved TTFB
   //    // Optimize memory usage
   //    memoryBasedWorkersCount: true,
   //    // Pre-fetch capabilities to improve performance
   //    // typedRoutes: true,
   //    // More efficient chunking
   //    optimizePackageImports: ['react', 'react-dom', 'lodash'],
   // },

   // Optimize Cloudfront-hosted images
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
      // Change this to false to use Next.js image optimization
      // Only use unoptimized if your CloudFront is already optimizing images
      unoptimized: true,
      // Configure image device sizes for responsive images
      // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
      // // Configure image size to generate
      // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      // // Set image format preferences
      // formats: ['image/webp', 'image/avif'],
      // Increase cache duration
      minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
   },

   // Enhanced caching headers for better performance
   async headers() {
      return [
         // Static assets with long-term caching
         {
            source: '/_next/static/:path*',
            headers: [
               {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
               },
            ],
         },
         // Static files
         {
            source: '/static/:path*',
            headers: [
               {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
               },
            ],
         },
         // Images with a moderate cache
         {
            source: '/_next/image/:path*',
            headers: [
               {
                  key: 'Cache-Control',
                  value: 'public, max-age=86400, stale-while-revalidate=31536000',
               },
            ],
         },
         // Add default security headers to all routes
         {
            source: '/:path*',
            headers: [
               {
                  key: 'X-DNS-Prefetch-Control',
                  value: 'on',
               },
               {
                  key: 'X-XSS-Protection',
                  value: '1; mode=block',
               },
               {
                  key: 'X-Content-Type-Options',
                  value: 'nosniff',
               },
               {
                  key: 'Referrer-Policy',
                  value: 'origin-when-cross-origin',
               },
            ],
         },
         // Set cache header for reports listing
         {
            source: '/reports',
            headers: [
               {
                  key: 'Cache-Control',
                  value: 'public, max-age=3600, stale-while-revalidate=86400',
               },
            ],
         },
         // Set longer cache for report details
         {
            source: '/reports/:slug',
            headers: [
               {
                  key: 'Cache-Control',
                  value: 'public, max-age=86400, stale-while-revalidate=604800',
               },
            ],
         },
      ];
   },

   // Keep existing redirects
   async redirects() {
      return [
         {
            source: '/zh-TW/:path*',
            destination: '/zh-Hant-TW/:path*',
            permanent: true,
         },
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
      ];
   },

   // Optimize webpack configuration
   webpack: (config, { dev, isServer }) => {
      // Optimize production builds
      if (!dev) {
         // Split large chunks for better loading
         config.optimization.splitChunks = {
            chunks: 'all',
            maxInitialRequests: 25,
            minSize: 20000,
            cacheGroups: {
               default: false,
               vendors: false,
               // Bundle common frameworks separately
               framework: {
                  name: 'framework',
                  test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types)[\\/]/,
                  priority: 40,
                  enforce: true,
               },
               // Bundle common libraries separately
               lib: {
                  test: /[\\/]node_modules[\\/]/,
                  name(module) {
                     const packageName = module.context.match(
                        /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                     )[1];
                     return `npm.${packageName.replace('@', '')}`;
                  },
                  priority: 30,
                  minChunks: 2,
                  reuseExistingChunk: true,
               },
               // Bundle common components
               commons: {
                  name: 'commons',
                  minChunks: 5,
                  priority: 20,
               },
               // Bundle shared code
               shared: {
                  name: 'shared',
                  minChunks: 2,
                  priority: 10,
                  reuseExistingChunk: true,
               },
            },
         };
      }

      return config;
   },

   // Set specific environment variables for more advanced control
   env: {
      NEXT_PUBLIC_ASSET_PREFIX: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
      NEXT_ISR_CACHE_ENABLED: 'true',
   },
};

export default nextConfig;
