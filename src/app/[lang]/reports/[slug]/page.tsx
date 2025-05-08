// export const runtime = 'edge';
import Header from '@/components/Report/Header';
import ReportBlock from '@/components/Report/ReportBlock';
import {
   getAllReports,
   getReportsPageBySlug,
   getMostViewedReports,
} from '@/utils/api/services';
import { SUPPORTED_LOCALES } from '@/utils/constants';
import { absoluteUrl, removeTrailingslash } from '@/utils/generic-methods';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';

const ExploreProjects = dynamic(
   () => import('@/components/Report/ExploreProjects'),
);

// Enable ISR with a longer cache duration for report details
export const revalidate = 3600; // 24 hours

// Pre-generate the most popular report pages
// export async function generateStaticParams() {
//    try {
//       // Get top 50 most viewed reports
//       const topReports = await getMostViewedReports(50);

//       return topReports.data.map((report: any) => ({
//          slug: report.attributes.slug,
//       }));
//    } catch (error) {
//       console.error('Error generating static params:', error);
//       // Return an empty array if fetching fails
//       return [];
//    }
// }

export async function generateMetadata({
   params,
}: {
   params: {
      slug: string;
      lang: string;
   };
}): Promise<Metadata> {
   const reportDataList = await getReportsPageBySlug(params.slug, params.lang);
   const reportPage =
      reportDataList.data?.length > 0 ? reportDataList.data[0] : null;

   if (!reportPage) {
      return {
         title: 'Report Not Found',
         description: 'The requested report could not be found.',
      };
   }

   const { attributes } = reportPage;
   const seo = attributes?.seo;

   // Create languages map for alternates
   const languagesMap: Record<string, string> = {};

   SUPPORTED_LOCALES.filter((locale) => locale !== 'en').forEach((locale) => {
      languagesMap[locale] = absoluteUrl(`/${locale}/reports/${params.slug}`);
   });

   const canonicalUrl = removeTrailingslash(
      seo?.canonicalURL || absoluteUrl(`/reports/${params.slug}`),
   );

   // Base metadata object
   const metadata: Metadata = {
      title: seo?.metaTitle || attributes?.title,
      description: seo?.metaDescription || attributes?.shortDescription,

      openGraph: {
         title:
            seo?.metaSocial?.find(
               (social: any) => social.socialNetwork === 'facebook',
            )?.title ||
            seo?.metaTitle ||
            attributes?.title,
         description:
            seo?.metaSocial?.find(
               (social: any) => social.socialNetwork === 'facebook',
            )?.description ||
            seo?.metaDescription ||
            attributes?.shortDescription,
         type: 'article',
         url: absoluteUrl(`/reports/${params.slug}`),
         images: [
            {
               url:
                  seo?.metaSocial?.find(
                     (social: any) => social.socialNetwork === 'facebook',
                  )?.image?.url ||
                  seo?.metaImage?.url ||
                  attributes?.highlightImage?.data?.attributes?.url,
               width: 1200,
               height: 630,
               alt: attributes?.title,
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
            attributes?.title,
         description:
            seo?.metaSocial?.find(
               (social: any) => social.socialNetwork === 'twitter',
            )?.description ||
            seo?.metaDescription ||
            attributes?.shortDescription,
         images: [
            seo?.metaSocial?.find(
               (social: any) => social.socialNetwork === 'twitter',
            )?.image?.url ||
               seo?.metaImage?.url ||
               attributes?.highlightImage?.data?.attributes?.url,
         ],
      },

      keywords: seo?.keywords || '',

      alternates: {
         canonical: canonicalUrl,
         languages: languagesMap,
      },

      other: {
         'script:ld+json': [
            JSON.stringify({
               '@context': 'https://schema.org',
               '@type': 'Article',
               headline: attributes?.title,
               description: attributes?.shortDescription,
               image: attributes?.highlightImage?.data?.attributes?.url,
               datePublished: attributes?.oldPublishedAt,
               author: {
                  '@type': 'Organization',
                  name: 'UnivDatos',
               },
               publisher: {
                  '@type': 'Organization',
                  name: 'UnivDatos',
                  logo: {
                     '@type': 'ImageObject',
                     url: absoluteUrl('/logo.png'),
                  },
               },
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

async function isCompanyProfile(slug: string) {
   const profile = await import('@/utils/company-profile-mappings.json', {
      assert: { type: 'json' },
   });

   const data = profile.default as Array<string>;

   if (data.includes(slug)) {
      return true;
   }

   return false;
}

// Create a simple in-memory cache for related reports by industry
const relatedReportsCache = new Map();

const ReportDetailPage: React.FC<{
   params: {
      slug: string;
      lang: string;
   };
}> = async ({ params }) => {
   let reportPage = null;
   let relatedReportsData = [];

   try {
      // Fetch the report data
      const reportDataList = await getReportsPageBySlug(
         params.slug,
         params.lang,
      );

      reportPage =
         reportDataList.data?.length > 0 ? reportDataList.data[0] : null;

      if (!reportPage) {
         const hasCompanyProfile = await isCompanyProfile(params.slug);
         if (hasCompanyProfile) {
            redirect('/');
         } else {
            notFound();
         }
      }

      // Get industry ID for related reports
      const industryId = reportPage?.attributes?.industry?.data?.id;
      const cahceKey = `relatedReports_${industryId}_${params.lang}`;

      // Check if related reports for this industry are already in cache
      if (industryId && relatedReportsCache.has(cahceKey)) {
         relatedReportsData = relatedReportsCache.get(cahceKey);
      } else if (industryId) {
         // Fetch related reports if not in cache
         const relatedReports = await getAllReports({
            page: 1,
            limit: 10,
            filters: {
               industry: industryId,
            },
            sortBy: 'oldPublishedAt:desc',
            locale: params.lang,
         });
         relatedReportsData =
            relatedReports?.data?.map((report: any) => report?.attributes) ??
            [];

         // Store in cache (if there are results)
         if (relatedReportsData.length > 0) {
            relatedReportsCache.set(cahceKey, relatedReportsData);
         }
      }
   } catch (err) {
      console.error('Error fetching report details:', err);
      const hasCompanyProfile = await isCompanyProfile(params.slug);
      if (!hasCompanyProfile) {
         notFound();
      } else {
         redirect('/');
      }
   }

   // If we still have no report page after all error handling, show not found
   if (!reportPage) {
      notFound();
   }

   return (
      <div className='bg-s-50'>
         <div className='mt-4' />
         <Header data={reportPage} locale={params.lang} />
         <ReportBlock data={reportPage} locale={params.lang} />
         {relatedReportsData.length > 0 && (
            <ExploreProjects
               reports={relatedReportsData}
               locale={params.lang}
            />
         )}
      </div>
   );
};

export default ReportDetailPage;
