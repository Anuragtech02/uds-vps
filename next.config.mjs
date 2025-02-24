/** @type {import('next').NextConfig} */
const nextConfig = {
   output: 'standalone',
   compress: true,
   experimental: {
      optimizeCss: true,
      optimizeServerReact: true,
   },
   poweredByHeader: false,
   swcMinify: true,
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
      ],
      unoptimized: process.env.NODE_ENV === 'production',
   },
   webpack: (config, { dev, isServer }) => {
      // Keep the original configuration
      const originalConfig = { ...config };

      // Only apply production optimizations
      if (!dev) {
         // Add Compression Plugin for JS and CSS if not already configured
         const CompressionPlugin = require('compression-webpack-plugin');
         originalConfig.plugins.push(
            new CompressionPlugin({
               test: /\.(js|css|html|svg)$/,
               algorithm: 'gzip',
               threshold: 10240, // Only compress assets bigger than 10KB
               minRatio: 0.8, // Only compress if compression ratio is better than 0.8
            }),
         );

         // Optimize chunks
         originalConfig.optimization = {
            ...originalConfig.optimization,
            runtimeChunk: 'single',
            splitChunks: {
               chunks: 'all',
               maxInitialRequests: Infinity,
               minSize: 20000,
               cacheGroups: {
                  vendor: {
                     test: /[\\/]node_modules[\\/]/,
                     name(module) {
                        // Get the name of the npm package
                        const packageName = module.context.match(
                           /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                        )[1];

                        // Return a unique name for the chunk
                        return `npm.${packageName.replace('@', '')}`;
                     },
                  },
               },
            },
         };
      }

      return originalConfig;
   },
   async headers() {
      return [
         {
            // Apply these headers to all routes
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
                  key: 'X-Frame-Options',
                  value: 'SAMEORIGIN',
               },
               {
                  key: 'X-Content-Type-Options',
                  value: 'nosniff',
               },
            ],
         },
         {
            // Cache static assets aggressively
            source: '/static/:path*',
            headers: [
               {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
               },
            ],
         },
         {
            // Cache images
            source: '/images/:path*',
            headers: [
               {
                  key: 'Cache-Control',
                  value: 'public, max-age=86400',
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
