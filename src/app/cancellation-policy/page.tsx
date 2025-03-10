import ClientSearchHero from '@/components/Home/ClientSearchHero';
import NewsSidebar from '@/components/News/NewsSidebar';
import { getCancellationPolicy } from '@/utils/api/services';
import { Metadata } from 'next';
import { absoluteUrl } from '@/utils/generic-methods';
import { SUPPORTED_LOCALES } from '@/utils/constants';

// export const runtime = 'edge';

// Set ISR revalidation period to 1 day (86400 seconds)
export const revalidate = 86400;

// Generate metadata for the Cancellation Policy page
export async function generateMetadata(): Promise<Metadata> {
   try {
      const cancellationPolicyData = await getCancellationPolicy();
      const { attributes } = cancellationPolicyData.data;
      const seo = attributes?.seo;

      // Create languages map for alternates
      const languagesMap: Record<string, string> = {};

      // Add all supported locales except English
      SUPPORTED_LOCALES.filter((locale) => locale !== 'en').forEach(
         (locale) => {
            languagesMap[locale] = absoluteUrl(
               `/${locale}/cancellation-policy`,
            );
         },
      );

      const metadata: Metadata = {
         title: seo?.metaTitle || 'Cancellation & Refund Policy | UnivDatos',
         description:
            seo?.metaDescription ||
            'Our cancellation and refund policy details the terms and conditions for cancellations, returns, and refunds when using UnivDatos services.',

         openGraph: {
            title:
               seo?.metaSocial?.find(
                  (social: any) => social.socialNetwork === 'facebook',
               )?.title ||
               seo?.metaTitle ||
               'Cancellation & Refund Policy | UnivDatos',
            description:
               seo?.metaSocial?.find(
                  (social: any) => social.socialNetwork === 'facebook',
               )?.description ||
               seo?.metaDescription ||
               'Our cancellation and refund policy details the terms and conditions for cancellations, returns, and refunds.',
            type: 'website',
            url: absoluteUrl('/cancellation-policy'),
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
                  alt: 'Cancellation & Refund Policy | UnivDatos',
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
               'Cancellation & Refund Policy | UnivDatos',
            description:
               seo?.metaSocial?.find(
                  (social: any) => social.socialNetwork === 'twitter',
               )?.description ||
               seo?.metaDescription ||
               'Our cancellation and refund policy details the terms and conditions for cancellations, returns, and refunds.',
            images: [
               seo?.metaSocial?.find(
                  (social: any) => social.socialNetwork === 'twitter',
               )?.image?.url ||
                  seo?.metaImage?.url ||
                  absoluteUrl('/logo.png'),
            ],
         },

         keywords:
            seo?.keywords ||
            'Cancellation Policy, Refund Policy, Return Policy, UnivDatos, Terms and Conditions, Product Cancellation',

         alternates: {
            canonical: seo?.canonicalURL || absoluteUrl('/cancellation-policy'),
            languages: languagesMap,
         },

         other: {
            'script:ld+json': [
               JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'WebPage',
                  name: 'Cancellation & Refund Policy',
                  description:
                     'Our cancellation and refund policy details the terms and conditions for cancellations, returns, and refunds.',
                  publisher: {
                     '@type': 'Organization',
                     name: 'UnivDatos',
                     logo: absoluteUrl('/logo.png'),
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
   } catch (error) {
      console.error('Error generating metadata:', error);
      // Return default metadata if there's an error
      return {
         title: 'Cancellation & Refund Policy | UnivDatos',
         description:
            'Our cancellation and refund policy details the terms and conditions for cancellations, returns, and refunds when using UnivDatos services.',
      };
   }
}

const CancellationPolicy = async () => {
   try {
      const res = await getCancellationPolicy();
      const data = res.data.attributes;

      return (
         <div className='bg-s-50'>
            <div className='mt-[100px] flex items-center justify-center border-b pb-10 pt-20 sm:mt-[150px] sm:py-20'>
               <h1 className='font-bold'>{data?.heroHeading}</h1>
            </div>
            <div className='container mt-10'>
               <div className='flex flex-col justify-start gap-6 pb-8 md:gap-10 lg:flex-row'>
                  <div className='flex-[0.7]'>
                     <div
                        className='report-content'
                        dangerouslySetInnerHTML={{
                           __html: data?.description ?? '',
                        }}
                     />
                  </div>
                  <div className='flex-[0.3] space-y-4 md:space-y-6'>
                     <div className='w-full [&>div]:w-full'>
                        <ClientSearchHero />
                     </div>
                     <NewsSidebar />
                  </div>
               </div>
            </div>
         </div>
      );
   } catch (error) {
      console.error('Error fetching cancellation policy:', error);
      return (
         <div className='bg-s-50'>
            <div className='mt-[100px] flex items-center justify-center border-b pb-10 pt-20 sm:mt-[150px] sm:py-20'>
               <h1 className='font-bold'>Cancellation & Refund Policy</h1>
            </div>
            <div className='container py-10'>
               <p>
                  There was an error loading the cancellation and refund policy
                  content. Please try again later.
               </p>
            </div>
         </div>
      );
   }
};

export default CancellationPolicy;
