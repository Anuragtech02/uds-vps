// export const runtime = 'edge';

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
import { SUPPORTED_LOCALES } from '@/utils/constants';
import dynamic from 'next/dynamic';

const RecentResearch = dynamic(
   () => import('@/components/Home/RecentResearch'),
);

const LatestResearch = dynamic(
   () => import('@/components/Home/LatestResearch'),
);

export async function generateMetadata(): Promise<Metadata> {
   const homePage = await getHomePage();
   const { attributes } = homePage.data;
   const seo = attributes?.seo;

   // Create languages map for alternates
   const languagesMap: Record<string, string> = {};

   // Add all supported locales except English
   SUPPORTED_LOCALES.filter((locale) => locale !== 'en').forEach((locale) => {
      languagesMap[locale] = absoluteUrl(`/${locale}`);
   });

   const metadata: Metadata = {
      title: seo?.metaTitle || attributes?.heroMainHeading,
      description: seo?.metaDescription || attributes?.heroSubHeading,

      openGraph: {
         title:
            seo?.metaSocial?.find(
               (social: any) => social.socialNetwork === 'facebook',
            )?.title ||
            seo?.metaTitle ||
            attributes?.heroMainHeading,
         description:
            seo?.metaSocial?.find(
               (social: any) => social.socialNetwork === 'facebook',
            )?.description ||
            seo?.metaDescription ||
            attributes?.heroSubHeading,
         type: 'website',
         url: absoluteUrl('/'),
         images: [
            {
               url:
                  seo?.metaSocial?.find(
                     (social: any) => social.socialNetwork === 'facebook',
                  )?.image?.url ||
                  seo?.metaImage?.url ||
                  absoluteUrl('/logo.png'),
               width: 1200,
               height: 630,
               alt: attributes?.heroMainHeading,
            },
         ],
         siteName: 'UnivDatos',
      },

      twitter: {
         card: 'summary_large_image',
         title:
            seo?.metaSocial?.find(
               (social: any) => social.socialNetwork === 'twitter',
            )?.title ||
            seo?.metaTitle ||
            attributes?.heroMainHeading,
         description:
            seo?.metaSocial?.find(
               (social: any) => social.socialNetwork === 'twitter',
            )?.description ||
            seo?.metaDescription ||
            attributes?.heroSubHeading,
         images: [
            seo?.metaSocial?.find(
               (social: any) => social.socialNetwork === 'twitter',
            )?.image?.url ||
               seo?.metaImage?.url ||
               absoluteUrl('/logo.png'),
         ],
      },

      keywords: seo?.keywords || '',

      alternates: {
         canonical: seo?.canonicalURL || absoluteUrl('/'),
         languages: languagesMap,
      },

      other: {
         'script:ld+json': [
            JSON.stringify({
               '@context': 'https://schema.org',
               '@type': 'Organization',
               name: 'UnivDatos',
               url: absoluteUrl('/'),
               logo: absoluteUrl('/logo.png'),
               description: attributes?.heroSubHeading,
               sameAs: [
                  // Add your social media URLs here
                  'https://twitter.com/univdatos',
                  'https://www.linkedin.com/company/univdatos',
                  // Add more social media links as needed
               ],
               ...seo?.structuredData,
            }),
         ],
      },
   };

   // Add extra scripts if defined
   if (seo?.extraScripts) {
      metadata.other = {
         ...metadata.other,
         ...seo.extraScripts,
      };
   }

   return metadata;
}

async function Home() {
   let homePage: Awaited<ReturnType<typeof getHomePage>>;
   let upcomingReports: Awaited<ReturnType<typeof getAllReports>>;
   let latestReports: Awaited<ReturnType<typeof getAllReports>>;
   let latestBlogs: Awaited<ReturnType<typeof getBlogsListingPage>>;
   let latestNewsArticles: Awaited<ReturnType<typeof getNewsListingPage>>;

   try {
      [
         homePage,
         upcomingReports,
         latestReports,
         latestBlogs,
         latestNewsArticles,
      ] = await Promise.all([
         getHomePage(),
         getAllReports(1, 10, {
            status: 'UPCOMING',
         }),
         getAllReports(1, 10, {
            status: 'LIVE',
         }),
         getBlogsListingPage(1, 1),
         getNewsListingPage(1, 3),
      ]);
   } catch (error) {
      console.error('Error fetching upcoming reports:', error);
   }

   const mediaCitation = {
      mediaSectionTitle: homePage?.data?.attributes?.mediaSectionHeading,
      mediaSectionDescription:
         homePage?.data?.attributes?.mediaSectionDescription,
      mediaSecrtionLogos:
         homePage?.data?.attributes?.mediaSectionLogos.data?.map(
            (img: any) => img.attributes,
         ),
   };

   const upcomingReportList = upcomingReports?.data?.map((report: any) => ({
      id: report?.id,
      slug: report?.attributes?.slugCopy,
      title: report?.attributes?.title,
      shortDescription: report?.attributes?.shortDescription,
      publishedAt: report?.attributes?.publishedAt,
      highlightImage: report?.attributes?.highlightImage,
   }));

   const latestReportList = latestReports?.data?.map((report: any) => ({
      id: report?.id,
      slug: report?.attributes?.slugCopy,
      title: report?.attributes?.title,
      shortDescription: report?.attributes?.shortDescription,
      publishedAt: report?.attributes?.publishedAt,
      highlightImage: report?.attributes?.highlightImage,
   }));

   return (
      <>
         <Hero data={homePage} />
         <RecentResearch data={homePage} />
         <Testimonials data={homePage} />
         <LatestResearch
            data={homePage}
            reports={latestReportList}
            upcomingReports={upcomingReportList}
         />
         <MediaCitation mediaCitation={mediaCitation} />
         <UpcomingReports
            data={{ upcomingReports: upcomingReportList, homePage }}
         />
         <NewsRoom
            data={{
               blogs: latestBlogs?.data?.map((blog: any) => blog.attributes),
               newsArticles: latestNewsArticles?.data?.map(
                  (newsArticle: any) => newsArticle.attributes,
               ),
            }}
         />
      </>
   );
}

export default function Page() {
   return <Home />;
}
