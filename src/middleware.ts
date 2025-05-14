// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import {
   DEFAULT_LOCALE,
   SUPPORTED_LOCALES,
   validRoutes, // Ensure this includes 'reports', 'blogs', 'news', 'about-us', 'contact-us', 'cart', etc.
} from './utils/constants'; // Make sure these constants are correctly defined

export const locales = SUPPORTED_LOCALES;
export const defaultLocale = DEFAULT_LOCALE;

// Helper function (keep as is or remove if not used for googtrans)
function setLocaleCookies(
   request: NextRequest,
   response: NextResponse,
   locale: string,
   currentHost: string,
) {
   response.headers.append('x-url', request.url); // Useful for debugging
   response.headers.append('x-middleware-locale', locale); // For debugging which locale middleware decided on
   return response;
}

const INDUSTRY_MAP: {
   [key: string]: string;
} = {
   'energy-power': 'energy-and-power',
   'consumer-goods-news': 'consumer-goods',
   'automotive-news': 'automotive',
   'electronics-semiconductor-news': 'electronics-semiconductor',
   'healthcare-news': 'healthcare',
   'telecom-it-news': 'telecom-it',
   'artificial-intelligence': 'artificial-intelligence-analytics',
   'electronics-semiconductor': 'electronics-semiconductor',
   'media-entertainment-blog': 'media-entertainment',
   'agriculture-food-tech': 'agriculture',
   'consumer-goods': 'consumer-goods',
   'advance-materials-chemicals': 'chemical',
   'telecom-it': 'telecom-it',
   healthcare: 'healthcare',
   automotive: 'automotive',
};

export async function middleware(request: NextRequest) {
   const { pathname, searchParams } = request.nextUrl;
   const currentHost = request.headers.get('host') || '';

   console.log(
      `[MW_START] Path: ${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`,
   );

   // 0. Immediately reject .php requests (common bot traffic)
   if (pathname.endsWith('.php')) {
      console.log(`[MW_REJECT_PHP] Rejecting .php path: ${pathname}`);
      return new NextResponse(null, { status: 404 }); // Or 403 Forbidden
   }

   // 1. Early Exits for Assets & Internal Next.js paths (check your matcher in config too)
   if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/api/') || // Your own APIs
      pathname.includes('/sitemap.xsl') || // Specific sitemap utility
      pathname.startsWith('/sitemaps/') // If you serve sitemaps from /public/sitemaps or a route handler
      // that doesn't need this full middleware logic
   ) {
      console.log(`[MW_BYPASS_INTERNAL_ASSET_API] Path: ${pathname}`);
      // For these, we typically don't need to set locale cookies or do complex logic
      return NextResponse.next();
   }

   // 2. Specific file/utility handlers
   if (pathname.includes('googlea315237f11c90f9d.html')) {
      // Be specific
      console.log(`[MW_HANDLER_GOOGLE_VERIF]`);
      return new Response(
         'google-site-verification: googlea315237f11c90f9d.html',
         {
            headers: {
               'Content-Type': 'text/html',
               'Cache-Control': 'public, max-age=86400, s-maxage=86400',
            },
         },
      );
   }

   if (pathname === '/robots.txt') {
      console.log(`[MW_HANDLER_ROBOTS_TXT]`);
      const robotsTxt = `User-agent: *\nAllow: /\n\nDisallow: /api/\nDisallow: /_next/\nDisallow: /static/\n\nUser-agent: Googlebot-News\nAllow: /news/\n\nSitemap: https://univdatos.com/sitemaps/sitemap.xml`;
      return new Response(robotsTxt, {
         headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
         },
      });
   }
   // Example: Sitemap index redirect (if you serve it from Strapi)
   // if (pathname === '/sitemap.xml' && process.env.API_URL) {
   //    console.log(`[MW_HANDLER_SITEMAP_XML_REDIRECT]`);
   //    return NextResponse.redirect(`${process.env.API_URL}/sitemap/index.xml`, { status: 301 });
   // }

   // 3. Determine Locale and Base Path Information
   const pathSegments = pathname.split('/').filter(Boolean);
   let detectedLocale = defaultLocale;
   let pathWithoutLocale = pathname;
   let hasLocalePrefix = false;

   if (
      pathSegments.length > 0 &&
      locales.includes(pathSegments[0] as typeof DEFAULT_LOCALE)
   ) {
      detectedLocale = pathSegments[0] as typeof DEFAULT_LOCALE;
      // Reconstruct pathWithoutLocale carefully
      if (pathSegments.length === 1) {
         // Path was just /en or /ja
         pathWithoutLocale = '/';
      } else {
         pathWithoutLocale = '/' + pathSegments.slice(1).join('/');
      }
      hasLocalePrefix = true;
      console.log(
         `[MW_LOCALE_INFO] Detected: ${detectedLocale}, Path w/o locale: ${pathWithoutLocale}, Original: ${pathname}`,
      );
   } else {
      console.log(
         `[MW_LOCALE_INFO] No locale prefix for ${pathname}, using default: ${defaultLocale}, Path w/o locale: ${pathWithoutLocale}`,
      );
   }

   // 4. Handle direct locale URLs (e.g. /ja, /es).
   // This should only match if the path is *exactly* /<locale>
   if (
      pathSegments.length === 1 &&
      locales.includes(pathSegments[0] as typeof DEFAULT_LOCALE)
   ) {
      console.log(
         `[MW_DIRECT_LOCALE_PATH] Path: ${pathname}. Redirecting to localized homepage /${detectedLocale}/`,
      );
      // Redirect to the localized homepage to ensure consistent URL structure
      const redirectUrl = new URL(`/${detectedLocale}/`, request.url); // Ensure trailing slash for homepage
      return NextResponse.redirect(redirectUrl);
   }

   // 5. Handle known application routes (blogs, news, reports, about-us, etc.) AFTER locale stripping
   // pathWithoutLocale will be like /reports/slug, /blogs, /news/slug, /about-us, /
   const firstSegmentOfPathWithoutLocale =
      pathWithoutLocale.split('/').filter(Boolean)[0] || ''; // handle '/' case

   // Special handling for root path AFTER locale stripping
   if (pathWithoutLocale === '/') {
      console.log(
         `[MW_VALID_ROUTE_ROOT] Root path after locale strip: ${pathWithoutLocale} (orig: ${pathname}). Passing through.`,
      );
      return setLocaleCookies(
         request,
         NextResponse.next(),
         detectedLocale,
         currentHost,
      );
   }

   if (
      firstSegmentOfPathWithoutLocale &&
      validRoutes.includes(firstSegmentOfPathWithoutLocale)
   ) {
      console.log(
         `[MW_VALID_ROUTE] Segment: '${firstSegmentOfPathWithoutLocale}' in validRoutes. Path: ${pathWithoutLocale} (orig: ${pathname}). Passing through.`,
      );
      return setLocaleCookies(
         request,
         NextResponse.next(),
         detectedLocale,
         currentHost,
      );
   }
   console.log(
      `[MW_VALID_ROUTE_CHECK_FAILED] Segment: '${firstSegmentOfPathWithoutLocale}' not in validRoutes. Path: ${pathWithoutLocale} (orig: ${pathname}). Continuing...`,
   );

   // 6. Handle specific redirects that require API calls (category, product-tag, legacy php form)
   // These are expensive, so they come after faster checks.
   // Use pathWithoutLocale for matching patterns and detectedLocale for constructing new URLs.

   // Example: Category Blog Redirect
   if (pathWithoutLocale.startsWith('/category/blog/')) {
      const categorySlug = pathWithoutLocale.split('/category/blog/')[1];
      if (categorySlug) {
         console.log(`[MW_REDIRECT_CAT_BLOG] Category Slug: ${categorySlug}`);
         const industrySlugFromMap = INDUSTRY_MAP[categorySlug] || categorySlug;
         const newDestination = hasLocalePrefix
            ? `/${detectedLocale}/blogs?industries=${industrySlugFromMap}`
            : `/blogs?industries=${industrySlugFromMap}`;
         return NextResponse.redirect(new URL(newDestination, request.url), {
            status: 301,
         });
      }
   }
   // Example: Category News Redirect (similar to blog)
   if (pathWithoutLocale.startsWith('/category/news/')) {
      const categorySlug = pathWithoutLocale.split('/category/news/')[1];
      if (categorySlug) {
         console.log(`[MW_REDIRECT_CAT_NEWS] Category Slug: ${categorySlug}`);
         const industrySlugFromMap = INDUSTRY_MAP[categorySlug] || categorySlug;
         const newDestination = hasLocalePrefix
            ? `/${detectedLocale}/news?industries=${industrySlugFromMap}`
            : `/news?industries=${industrySlugFromMap}`;
         return NextResponse.redirect(new URL(newDestination, request.url), {
            status: 301,
         });
      }
   }

   // Product Tag Redirect
   const productTagMatch = pathWithoutLocale.match(/^\/product-tag\/(.+)/);
   if (productTagMatch) {
      const tagSlug = productTagMatch[1];
      console.log(`[MW_REDIRECT_PRODUCT_TAG] Tag Slug: ${tagSlug}`);
      try {
         const strapiResponse = await fetch(
            `${process.env.API_URL}/tag-mappings?filters[tagSlug][$eq]=${tagSlug}&locale=${detectedLocale}`, // Add locale
            { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } },
         );
         if (!strapiResponse.ok)
            throw new Error(`API error: ${strapiResponse.status}`);
         const data = await strapiResponse.json();

         if (data.data && data.data.length > 0) {
            const reportSlug = data.data[0].attributes.reportSlug;
            const redirectUrl = hasLocalePrefix
               ? `/${detectedLocale}/reports/${reportSlug}`
               : `/reports/${reportSlug}`;
            return NextResponse.redirect(new URL(redirectUrl, request.url));
         }
         const notFoundUrl = hasLocalePrefix
            ? `/${detectedLocale}/not-found`
            : '/not-found';
         return NextResponse.redirect(new URL(notFoundUrl, request.url));
      } catch (error) {
         console.error(
            `[MW_REDIRECT_PRODUCT_TAG_ERROR] Tag: ${tagSlug}`,
            error,
         );
         const errorRedirectUrl = hasLocalePrefix
            ? `/${detectedLocale}/not-found`
            : '/not-found';
         return NextResponse.redirect(new URL(errorRedirectUrl, request.url));
      }
   }

   // Legacy PHP Sample Form Redirect
   if (pathWithoutLocale.includes('/get-a-free-sample-form-php')) {
      // Match on pathWithoutLocale
      const productId = searchParams.get('product_id')?.trim();
      console.log(`[MW_REDIRECT_LEGACY_PHP_FORM] Product ID: ${productId}`);
      if (productId) {
         try {
            const cleanProductId = decodeURIComponent(productId).replace(
               /\s+/g,
               '',
            );
            const strapiResponse = await fetch(
               `${process.env.API_URL}/reports?filters[productId][$eq]=${cleanProductId}&locale=${detectedLocale}`, // Add locale
               {
                  headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
               },
            );
            if (!strapiResponse.ok)
               throw new Error(`API error: ${strapiResponse.status}`);
            const data = await strapiResponse.json();

            if (data.data && data.data.length > 0) {
               const reportSlug = data.data[0].attributes.slug;
               const redirectPath = hasLocalePrefix
                  ? `/${detectedLocale}/reports/${reportSlug}?popup=report-enquiry`
                  : `/reports/${reportSlug}?popup=report-enquiry`;
               return NextResponse.redirect(new URL(redirectPath, request.url));
            }
            const notFoundUrl = hasLocalePrefix
               ? `/${detectedLocale}/not-found`
               : '/not-found';
            return NextResponse.redirect(new URL(notFoundUrl, request.url));
         } catch (error) {
            console.error(
               `[MW_REDIRECT_LEGACY_PHP_FORM_ERROR] Product ID: ${productId}`,
               error,
            );
            const errorRedirectUrl = hasLocalePrefix
               ? `/${detectedLocale}/not-found`
               : '/not-found';
            return NextResponse.redirect(
               new URL(errorRedirectUrl, request.url),
            );
         }
      } else {
         // No product_id, maybe redirect to generic reports or not-found
         const fallbackRedirect = hasLocalePrefix
            ? `/${detectedLocale}/reports`
            : '/reports';
         return NextResponse.redirect(new URL(fallbackRedirect, request.url));
      }
   }

   // 7. SLOW PART: Fallback Slug Lookup for potential "orphan" slugs (e.g. /my-old-post)
   // This runs if NO other rule above matched the path structure.
   // potentialOrphanSlug is the first segment of pathWithoutLocale if it's a simple path like /slug
   const segmentsOfPathWithoutLocale = pathWithoutLocale
      .split('/')
      .filter(Boolean);
   const potentialOrphanSlug = segmentsOfPathWithoutLocale[0];
   const isLikelyOrphanSlugPath =
      segmentsOfPathWithoutLocale.length === 1 &&
      potentialOrphanSlug &&
      !validRoutes.includes(potentialOrphanSlug);

   if (isLikelyOrphanSlugPath) {
      console.log(
         `[MW_ORPHAN_SLUG_LOOKUP] Attempting lookup for slug: '${potentialOrphanSlug}' from path: ${pathWithoutLocale} (orig: ${pathname})`,
      );
      try {
         // Check blogs
         const blogsApiUrl = `${process.env.API_URL}/blogs?filters[slug][$eq]=${potentialOrphanSlug}&publicationState=live&locale=${detectedLocale}`;
         console.log(`[MW_ORPHAN_SLUG_LOOKUP_FETCH_BLOGS] URL: ${blogsApiUrl}`);
         const blogsResponse = await fetch(blogsApiUrl, {
            headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
         });

         if (blogsResponse.ok) {
            const blogsData = await blogsResponse.json();
            if (blogsData.data && blogsData.data.length > 0) {
               const redirectPath = hasLocalePrefix
                  ? `/${detectedLocale}/blogs/${potentialOrphanSlug}`
                  : `/blogs/${potentialOrphanSlug}`;
               console.log(
                  `[MW_ORPHAN_SLUG_FOUND_BLOGS] Redirecting to: ${redirectPath}`,
               );
               const response = NextResponse.redirect(
                  new URL(redirectPath, request.url),
                  301,
               );
               return setLocaleCookies(
                  request,
                  response,
                  detectedLocale,
                  currentHost,
               );
            }
         } else {
            console.warn(
               `[MW_ORPHAN_SLUG_LOOKUP_BLOGS_API_ERROR] Status: ${blogsResponse.status} for slug ${potentialOrphanSlug} at ${blogsApiUrl}`,
            );
         }

         // Check news
         const newsApiUrl = `${process.env.API_URL}/news-articles?filters[slug][$eq]=${potentialOrphanSlug}&publicationState=live&locale=${detectedLocale}`;
         console.log(`[MW_ORPHAN_SLUG_LOOKUP_FETCH_NEWS] URL: ${newsApiUrl}`);
         const newsResponse = await fetch(newsApiUrl, {
            headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
         });

         if (newsResponse.ok) {
            const newsData = await newsResponse.json();
            if (newsData.data && newsData.data.length > 0) {
               const redirectPath = hasLocalePrefix
                  ? `/${detectedLocale}/news/${potentialOrphanSlug}`
                  : `/news/${potentialOrphanSlug}`;
               console.log(
                  `[MW_ORPHAN_SLUG_FOUND_NEWS] Redirecting to: ${redirectPath}`,
               );
               const response = NextResponse.redirect(
                  new URL(redirectPath, request.url),
                  301,
               );
               return setLocaleCookies(
                  request,
                  response,
                  detectedLocale,
                  currentHost,
               );
            }
         } else {
            console.warn(
               `[MW_ORPHAN_SLUG_LOOKUP_NEWS_API_ERROR] Status: ${newsResponse.status} for slug ${potentialOrphanSlug} at ${newsApiUrl}`,
            );
         }

         console.log(
            `[MW_ORPHAN_SLUG_NOT_FOUND_IN_API] Slug '${potentialOrphanSlug}' not in blogs/news. Redirecting to not-found.`,
         );
         const notFoundUrl = hasLocalePrefix
            ? `/${detectedLocale}/not-found`
            : '/not-found';
         const response = NextResponse.redirect(
            new URL(notFoundUrl, request.url),
         );
         return setLocaleCookies(
            request,
            response,
            detectedLocale,
            currentHost,
         );
      } catch (error) {
         console.error(
            `[MW_ORPHAN_SLUG_LOOKUP_UNEXPECTED_ERROR] Slug: ${potentialOrphanSlug}`,
            error,
         );
         const errorRedirectUrl = hasLocalePrefix
            ? `/${detectedLocale}/not-found`
            : '/not-found';
         return NextResponse.redirect(new URL(errorRedirectUrl, request.url));
      }
   }

   // 8. Default pass-through if no other rule matched
   // This will catch paths like /unknown-path or /some/very/deep/path that isn't a valid route or orphan slug
   console.log(
      `[MW_PASS_THROUGH_DEFAULT] Path: ${pathname}. No specific rules matched or orphan slug logic not triggered. Letting Next.js handle.`,
   );
   return setLocaleCookies(
      request,
      NextResponse.next(),
      detectedLocale,
      currentHost,
   );
}

export const config = {
   matcher: [
      // Match all paths EXCEPT:
      '/((?!api/|_next/static/|_next/image/|sitemaps/|assets/|static/|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|otf|xml|xsl|txt|html|js|css)$).*)',
      // - /api/ routes
      // - Next.js internal static files, image optimization
      // - /sitemaps/ directory (if you have custom sitemap handling not needing this middleware)
      // - Common asset folders like /assets/ or /static/ (if served from /public)
      // - Common file extensions for static assets
   ],
};
