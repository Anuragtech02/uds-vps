import ClientSearchHero from '@/components/Home/ClientSearchHero';
import NewsSidebar from '@/components/News/NewsSidebar';
import { getDisclaimer } from '@/utils/api/services';
import { Metadata } from 'next';
import { absoluteUrl } from '@/utils/generic-methods';
import { SUPPORTED_LOCALES } from '@/utils/constants';

// export const runtime = 'edge';

// Set ISR revalidation period to 1 hour (3600 seconds)
export const revalidate = 3600;

// Generate metadata for the Disclaimer page
export async function generateMetadata(): Promise<Metadata> {
   try {
      const disclaimerData = await getDisclaimer();
      const { attributes } = disclaimerData.data;
      const seo = attributes?.seo;

      // Create languages map for alternates
      const languagesMap: Record<string, string> = {};

      // Add all supported locales except English
      SUPPORTED_LOCALES.filter((locale) => locale !== 'en').forEach(
         (locale) => {
            languagesMap[locale] = absoluteUrl(`/${locale}/disclaimer`);
         },
      );

      const metadata: Metadata = {
         title: seo?.metaTitle || 'Disclaimer | UnivDatos',
         description:
            seo?.metaDescription ||
            'Important disclaimers regarding the use of UnivDatos services, data, and reports. Please read carefully.',

         openGraph: {
            title:
               seo?.metaSocial?.find(
                  (social: any) => social.socialNetwork === 'facebook',
               )?.title ||
               seo?.metaTitle ||
               'Disclaimer | UnivDatos',
            description:
               seo?.metaSocial?.find(
                  (social: any) => social.socialNetwork === 'facebook',
               )?.description ||
               seo?.metaDescription ||
               'Important disclaimers regarding the use of UnivDatos services.',
            type: 'website',
            url: absoluteUrl('/disclaimer'),
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
                  alt: 'Disclaimer | UnivDatos',
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
               'Disclaimer | UnivDatos',
            description:
               seo?.metaSocial?.find(
                  (social: any) => social.socialNetwork === 'twitter',
               )?.description ||
               seo?.metaDescription ||
               'Important disclaimers regarding the use of UnivDatos services.',
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
            'Disclaimer, Liability, UnivDatos, Terms, Legal Notice, Limitations',

         alternates: {
            canonical: seo?.canonicalURL || absoluteUrl('/disclaimer'),
            languages: languagesMap,
         },

         other: {
            'script:ld+json': [
               JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'WebPage',
                  name: 'Disclaimer',
                  description:
                     'Important disclaimers regarding the use of UnivDatos services and data.',
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
         title: 'Disclaimer | UnivDatos',
         description:
            'Important disclaimers regarding the use of UnivDatos services, data, and reports.',
      };
   }
}

const Disclaimer = async () => {
   try {
      const res = await getDisclaimer();
      const data = res.data.attributes;

      return (
         <div className='bg-s-50'>
            <div className='mt-[100px] flex items-center justify-center border-b pb-10 pt-20 sm:mt-[150px] sm:py-20'>
               <h1 className='font-bold'>{data?.heroHeading}</h1>
            </div>
            <div className='container'>
               <div className='flex flex-col gap-6 pb-8 md:gap-10 lg:flex-row'>
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
      console.error('Error fetching disclaimer:', error);
      return (
         <div className='bg-s-50'>
            <div className='mt-[100px] flex items-center justify-center border-b pb-10 pt-20 sm:mt-[150px] sm:py-20'>
               <h1 className='font-bold'>Disclaimer</h1>
            </div>
            <div className='container py-10'>
               <p>
                  There was an error loading the disclaimer content. Please try
                  again later.
               </p>
            </div>
         </div>
      );
   }
};

export default Disclaimer;
