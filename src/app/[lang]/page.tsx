// app/[lang]/page.tsx

import MediaCitation from '@/components/commons/MediaCitation';
import Hero from '@/components/Home/Hero';
import NewsRoom from '@/components/Home/NewsRoom';
import Testimonials from '@/components/Home/Testimonials';
import UpcomingReports from '@/components/Home/UpcomingReports';
import {
   getAllReports,
   getBlogsListingPage,
   getHomePage,
   getNewsListingPage,
} from '@/utils/api/services';
import { Metadata } from 'next';
import { absoluteUrl } from '@/utils/generic-methods';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/utils/constants'; // Make sure DEFAULT_LOCALE is exported
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation'; // Import notFound

const RecentResearch = dynamic(
   () => import('@/components/Home/RecentResearch'),
);

const LatestResearch = dynamic(
   () => import('@/components/Home/LatestResearch'),
);

// Helper to validate lang and get a fallback
function getValidLocale(lang: string): string {
   if (
      SUPPORTED_LOCALES.includes(lang as typeof DEFAULT_LOCALE) &&
      !lang.includes('.')
   ) {
      return lang;
   }
   // If lang contains a dot (likely a filename) or not in supported locales,
   // either prepare to call notFound() or return a default.
   // For generateMetadata, we might want to build with default,
   // for Page component, we must call notFound().
   console.warn(
      `Invalid lang parameter detected: "${lang}". Falling back to default or preparing 404.`,
   );
   return DEFAULT_LOCALE; // Fallback for metadata, Page will handle 404
}

export async function generateMetadata({
   params,
}: {
   params: {
      lang: string;
   };
}): Promise<Metadata> {
   // Validate lang for metadata generation - usually build with default if invalid lang found during build
   // Or, if you want to strictly prevent building pages for invalid locales passed at build time:
   if (
      !SUPPORTED_LOCALES.includes(params.lang as typeof DEFAULT_LOCALE) ||
      params.lang.includes('.')
   ) {
      console.error(
         `[generateMetadata] Invalid lang parameter: "${params.lang}". Cannot generate metadata.`,
      );
      // Depending on strictness, you might throw an error or return minimal/default metadata
      // For now, let's try to fetch with default locale if original is bad, but log it.
      // Or simply return default:
      return {
         title: 'Page Not Found',
         description: 'The requested page does not exist for this language.',
      };
   }

   const validLang = params.lang; // Already validated above
   const homePageResponse = await getHomePage(validLang); // API service should also have internal validation/defaulting

   // Critical: Check if homePageResponse.data exists before destructuring
   if (!homePageResponse || !homePageResponse.data || homePageResponse.error) {
      console.error(
         `[generateMetadata] Failed to fetch homepage data for lang: ${validLang}. API response issue.`,
      );
      // Return default metadata or handle error appropriately
      return {
         title: 'Error Loading Page',
         description: 'Could not load page information at this time.',
      };
   }

   const { attributes } = homePageResponse.data;
   const seo = attributes?.seo;

   const languagesMap: Record<string, string> = {};
   SUPPORTED_LOCALES.filter((locale) => locale !== 'en').forEach((locale) => {
      languagesMap[locale] = absoluteUrl(`/${locale}`);
   });

   type TSocial = {
      socialNetwork: string;
      title: string;
      description: string;
      image: {
         url: string;
      };
   };

   const metadata: Metadata = {
      title:
         seo?.metaTitle ||
         attributes?.heroMainHeading ||
         'UnivDatos Market Insights',
      description:
         seo?.metaDescription ||
         attributes?.heroSubHeading ||
         'Leading market research firm.',
      openGraph: {
         title:
            seo?.metaSocial?.find(
               (social: TSocial) => social.socialNetwork === 'facebook',
            )?.title ||
            seo?.metaTitle ||
            attributes?.heroMainHeading ||
            'UnivDatos',
         description:
            seo?.metaSocial?.find(
               (social: TSocial) => social.socialNetwork === 'facebook',
            )?.description ||
            seo?.metaDescription ||
            attributes?.heroSubHeading ||
            'Market research insights.',
         type: 'website',
         url: absoluteUrl(`/${validLang}`), // Use validLang
         images: [
            {
               url:
                  seo?.metaSocial?.find(
                     (social: TSocial) => social.socialNetwork === 'facebook',
                  )?.image?.url ||
                  seo?.metaImage?.url ||
                  absoluteUrl('/logo.png'),
               width: 1200,
               height: 630,
               alt: attributes?.heroMainHeading || 'UnivDatos',
            },
         ],
         siteName: 'UnivDatos',
      },
      twitter: {
         card: 'summary_large_image',
         title:
            seo?.metaSocial?.find(
               (social: TSocial) => social.socialNetwork === 'twitter',
            )?.title ||
            seo?.metaTitle ||
            attributes?.heroMainHeading ||
            'UnivDatos',
         description:
            seo?.metaSocial?.find(
               (social: TSocial) => social.socialNetwork === 'twitter',
            )?.description ||
            seo?.metaDescription ||
            attributes?.heroSubHeading ||
            'Market research insights.',
         images: [
            seo?.metaSocial?.find(
               (social: TSocial) => social.socialNetwork === 'twitter',
            )?.image?.url ||
               seo?.metaImage?.url ||
               absoluteUrl('/logo.png'),
         ],
      },
      keywords: seo?.keywords || '',
      alternates: {
         canonical: seo?.canonicalURL || absoluteUrl(`/${validLang}`), // Use validLang
         languages: languagesMap,
      },
      // ... other metadata fields
   };
   if (seo?.extraScripts) {
      metadata.other = { ...metadata.other, ...seo.extraScripts };
   }
   return metadata;
}

async function Home({ params }: { params: { lang: string } }) {
   // lang is already validated by the Page component before rendering Home
   const validLang = params.lang;

   // Initialize with null or appropriate default to avoid 'undefined' issues
   let homePage: Awaited<ReturnType<typeof getHomePage>> | null = null;
   let upcomingReports: Awaited<ReturnType<typeof getAllReports>> | null = null;
   let latestReports: Awaited<ReturnType<typeof getAllReports>> | null = null;
   let latestBlogs: Awaited<ReturnType<typeof getBlogsListingPage>> | null =
      null;
   let latestNewsArticles: Awaited<
      ReturnType<typeof getNewsListingPage>
   > | null = null;

   // Use Promise.allSettled to handle individual promise failures
   const results = await Promise.allSettled([
      getHomePage(validLang),
      getAllReports({
         page: 1,
         limit: 10,
         filters: { status: 'UPCOMING' },
         locale: validLang,
      }),
      getAllReports({
         page: 1,
         limit: 10,
         filters: { status: 'LIVE' },
         sortBy: 'oldPublishedAt:desc',
         locale: validLang,
      }),
      getBlogsListingPage({ page: 1, limit: 1, locale: validLang }),
      getNewsListingPage({ page: 1, limit: 3, locale: validLang }),
   ]);

   // Process results from Promise.allSettled
   if (
      results[0].status === 'fulfilled' &&
      results[0].value &&
      !results[0].value.error
   ) {
      homePage = results[0].value;
   } else {
      console.error(
         'Error fetching homepage:',
         results[0].status === 'rejected'
            ? results[0].reason
            : 'API returned error',
      );
   }
   if (
      results[1].status === 'fulfilled' &&
      results[1].value &&
      !results[1].value.error
   ) {
      upcomingReports = results[1].value;
   } else {
      console.error(
         'Error fetching upcoming reports:',
         results[1].status === 'rejected'
            ? results[1].reason
            : 'API returned error',
      );
   }
   if (
      results[2].status === 'fulfilled' &&
      results[2].value &&
      !results[2].value.error
   ) {
      latestReports = results[2].value;
   } else {
      console.error(
         'Error fetching latest reports:',
         results[2].status === 'rejected'
            ? results[2].reason
            : 'API returned error',
      );
   }
   if (
      results[3].status === 'fulfilled' &&
      results[3].value &&
      !results[3].value.error
   ) {
      latestBlogs = results[3].value;
   } else {
      console.error(
         'Error fetching latest blogs:',
         results[3].status === 'rejected'
            ? results[3].reason
            : 'API returned error',
      );
   }
   if (
      results[4].status === 'fulfilled' &&
      results[4].value &&
      !results[4].value.error
   ) {
      latestNewsArticles = results[4].value;
   } else {
      console.error(
         'Error fetching latest news articles:',
         results[4].status === 'rejected'
            ? results[4].reason
            : 'API returned error',
      );
   }

   // Critical check: If homepage data failed to load, show an error message.
   if (!homePage || !homePage.data) {
      // Check for homePage.data specifically
      return (
         <div>
            Error: Homepage content could not be loaded. Please try again later.
         </div>
      );
   }

   const mediaCitation = {
      mediaSectionTitle:
         homePage.data.attributes?.mediaSectionHeading || 'Media Mentions',
      mediaSectionDescription:
         homePage.data.attributes?.mediaSectionDescription || '',
      mediaSecrtionLogos:
         homePage.data.attributes?.mediaSectionLogos?.data?.map(
            (img: any) => img.attributes,
         ) || [],
   };

   const upcomingReportList =
      upcomingReports?.data?.map((report: any) => ({
         id: report?.id,
         slug: report?.attributes?.slug,
         title: report?.attributes?.title,
         shortDescription: report?.attributes?.shortDescription,
         publishedAt: report?.attributes?.publishedAt,
         highlightImage: report?.attributes?.highlightImage,
      })) || [];

   const latestReportList =
      latestReports?.data?.map((report: any) => ({
         id: report?.id,
         slug: report?.attributes?.slug,
         title: report?.attributes?.title,
         shortDescription: report?.attributes?.shortDescription,
         publishedAt: report?.attributes?.publishedAt,
         highlightImage: report?.attributes?.highlightImage,
      })) || [];

   return (
      <>
         {/* Ensure components can handle potentially null data or default values */}
         <Hero data={homePage} locale={validLang} />
         <RecentResearch data={homePage} />
         <Testimonials data={homePage} />
         <LatestResearch
            data={homePage}
            reports={latestReportList}
            upcomingReports={upcomingReportList}
            locale={validLang}
         />
         <MediaCitation mediaCitation={mediaCitation} />
         <UpcomingReports
            data={{ upcomingReports: upcomingReportList, homePage }}
         />
         <NewsRoom
            data={{
               blogs:
                  latestBlogs?.data?.map((blog: any) => blog.attributes) || [],
               newsArticles:
                  latestNewsArticles?.data?.map(
                     (newsArticle: any) => newsArticle.attributes,
                  ) || [],
            }}
            locale={validLang}
         />
      </>
   );
}

export default function Page({ params }: { params: { lang: string } }) {
   // Runtime validation for the lang parameter for the page
   if (
      !SUPPORTED_LOCALES.includes(params.lang as typeof DEFAULT_LOCALE) ||
      params.lang.includes('.')
   ) {
      console.log(
         `[Page] Invalid lang parameter: "${params.lang}". Rendering 404.`,
      );
      notFound(); // This is crucial to prevent rendering with invalid lang
   }

   return <Home params={{ lang: params.lang }} />;
}
