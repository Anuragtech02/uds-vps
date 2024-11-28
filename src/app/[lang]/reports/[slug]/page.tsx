export const runtime = 'edge';

import ExploreProjects from '@/components/Report/ExploreProjects';
import Header from '@/components/Report/Header';
import ReportBlock from '@/components/Report/ReportBlock';
import ReportFAQs from '@/components/Report/ReportFAQs';
import { getAllReports, getReportsPageBySlug } from '@/utils/api/services';
import { absoluteUrl } from '@/utils/generic-methods';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic'; // Forces dynamic rendering, bypassing all static optimizations

export async function generateMetadata({
   params,
 }: {
   params: {
     slug: string;
   };
 }): Promise<Metadata> {
   const reportDataList = await getReportsPageBySlug(params.slug);
   const reportPage = reportDataList.data?.length > 0 ? reportDataList.data[0] : null;
 
   if (!reportPage) {
     return {
       title: 'Report Not Found',
       description: 'The requested report could not be found.',
     };
   }
 
   const { attributes } = reportPage;
   const seo = attributes?.seo;
   
   // Base metadata object
   const metadata: Metadata = {
     // Title with fallbacks
     title: seo?.metaTitle || attributes?.title,
     description: seo?.metaDescription || attributes?.shortDescription,
     
     // Open Graph
     openGraph: {
       title: seo?.metaSocial?.find((social: any) => social.socialNetwork === 'facebook')?.title || seo?.metaTitle || attributes?.title,
       description: seo?.metaSocial?.find((social: any) => social.socialNetwork === 'facebook')?.description || seo?.metaDescription || attributes?.shortDescription,
       type: 'article',
       url: absoluteUrl(`/reports/${params.slug}`),
       images: [
         {
           url: seo?.metaSocial?.find((social: any) => social.socialNetwork === 'facebook')?.image?.url || 
                seo?.metaImage?.url || 
                attributes?.highlightImage?.data?.attributes?.url,
           width: 1200,
           height: 630,
           alt: attributes?.title
         }
       ],
       siteName: 'UnivDatos',
     },
 
     // Twitter
     twitter: {
       card: 'summary_large_image',
       title: seo?.metaSocial?.find((social: any) => social.socialNetwork === 'twitter')?.title || seo?.metaTitle || attributes?.title,
       description: seo?.metaSocial?.find((social: any) => social.socialNetwork === 'twitter')?.description || seo?.metaDescription || attributes?.shortDescription,
       images: [
         seo?.metaSocial?.find((social: any) => social.socialNetwork === 'twitter')?.image?.url || 
         seo?.metaImage?.url || 
         attributes?.highlightImage?.data?.attributes?.url
       ],
     },
 
     // Additional metadata
     keywords: seo?.keywords || '',
     robots: seo?.metaRobots || 'index, follow',
     viewport: seo?.metaViewport || 'width=device-width, initial-scale=1',
     
     // Canonical URL
     alternates: {
       canonical: seo?.canonicalURL || absoluteUrl(`/reports/${params.slug}`)
     },
 
     // Structured Data
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
             name: 'UnivDatos'
           },
           publisher: {
             '@type': 'Organization',
             name: 'UnivDatos',
             logo: {
               '@type': 'ImageObject',
               url: absoluteUrl('/logo.png') // Make sure to update with your actual logo path
             }
           },
           ...seo?.structuredData
         })
       ]
     }
   };
 
   // Add any extra scripts if defined in SEO
   if (seo?.extraScripts) {
     metadata.other = {
       ...metadata.other,
       ...seo.extraScripts
     };
   }
 
   return metadata;
 }

const page: React.FC<{
   params: {
      slug: string;
   };
}> = async ({ params }) => {
   let relatedReports, reportDataList;
   try {
      reportDataList = await getReportsPageBySlug(params.slug);
      relatedReports = await getAllReports(1, 10, {
         industry: reportDataList.data[0]?.attributes?.industry?.data?.id,
      });
   } catch (err) {
      console.log(err);
   }
   console.log({ relatedReports });
   let reportPage =
      reportDataList.data?.length > 0 ? reportDataList.data[0] : null;
   let relatedReportsData =
      relatedReports?.data?.map((report: any) => report?.attributes) ?? [];
   return (
      <div className='bg-s-50'>
         <div className='mt-4' />
         <Header data={reportPage} />
         <ReportBlock data={reportPage} />
         <ExploreProjects reports={relatedReportsData} />
      </div>
   );
};

export default page;
