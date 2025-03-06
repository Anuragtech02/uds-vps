import ClientSearchHero from '@/components/Home/ClientSearchHero';
import NewsSidebar from '@/components/News/NewsSidebar';
import { getLegal } from '@/utils/api/services';
import { Metadata } from 'next';
import { absoluteUrl } from '@/utils/generic-methods';
import { SUPPORTED_LOCALES } from '@/utils/constants';

// export const runtime = 'edge';

// Set ISR revalidation period to 1 hour (3600 seconds)
export const revalidate = 3600;

// Generate metadata for the Legal page
export async function generateMetadata(): Promise<Metadata> {
   try {
      const legalData = await getLegal();
      const { attributes } = legalData.data;
      const seo = attributes?.seo;

      // Create languages map for alternates
      const languagesMap: Record<string, string> = {};

      // Add all supported locales except English
      SUPPORTED_LOCALES.filter((locale) => locale !== 'en').forEach(
         (locale) => {
            languagesMap[locale] = absoluteUrl(`/${locale}/legal`);
         },
      );

      const metadata: Metadata = {
         title: seo?.metaTitle || 'Legal Information | UnivDatos',
         description:
            seo?.metaDescription ||
            'Legal information, policies, and disclosures for UnivDatos. Important information regarding our services and your rights.',

         openGraph: {
            title:
               seo?.metaSocial?.find(
                  (social: any) => social.socialNetwork === 'facebook',
               )?.title ||
               seo?.metaTitle ||
               'Legal Information | UnivDatos',
            description:
               seo?.metaSocial?.find(
                  (social: any) => social.socialNetwork === 'facebook',
               )?.description ||
               seo?.metaDescription ||
               'Legal information, policies, and disclosures for UnivDatos.',
            type: 'website',
            url: absoluteUrl('/legal'),
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
                  alt: 'Legal Information | UnivDatos',
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
               'Legal Information | UnivDatos',
            description:
               seo?.metaSocial?.find(
                  (social: any) => social.socialNetwork === 'twitter',
               )?.description ||
               seo?.metaDescription ||
               'Legal information, policies, and disclosures for UnivDatos.',
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
            'Legal, Policies, Disclosures, UnivDatos, Compliance, Regulations',

         alternates: {
            canonical: seo?.canonicalURL || absoluteUrl('/legal'),
            languages: languagesMap,
         },

         other: {
            'script:ld+json': [
               JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'WebPage',
                  name: 'Legal Information',
                  description:
                     'Legal information, policies, and disclosures for UnivDatos.',
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
         title: 'Legal Information | UnivDatos',
         description:
            'Legal information, policies, and disclosures for UnivDatos. Important information regarding our services and your rights.',
      };
   }
}

const Legal = async () => {
   try {
      const res = await getLegal();
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
      console.error('Error fetching legal information:', error);
      return (
         <div className='bg-s-50'>
            <div className='mt-[100px] flex items-center justify-center border-b pb-10 pt-20 sm:mt-[150px] sm:py-20'>
               <h1 className='font-bold'>Legal Information</h1>
            </div>
            <div className='container py-10'>
               <p>
                  There was an error loading the legal information. Please try
                  again later.
               </p>
            </div>
         </div>
      );
   }
};

export default Legal;
