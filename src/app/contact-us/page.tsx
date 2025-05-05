// export const runtime = 'edge';
import ContactDetails from '@/components/Contact/ContactDetails';
import ContactForm from '@/components/Contact/ContactForm';
import { getContactPageData } from '@/utils/api/services';
import { SUPPORTED_LOCALES } from '@/utils/constants';
import { absoluteUrl } from '@/utils/generic-methods';
import { Metadata } from 'next';

// Set ISR revalidation period to 1 hour (3600 seconds)
export const revalidate = 86400;

// Enhanced metadata with more SEO attributes
export async function generateMetadata(): Promise<Metadata> {
   try {
      const contactData = await getContactPageData();
      const { attributes } = contactData.data;
      const seo = attributes?.seo;

      // Create languages map for alternates
      const languagesMap: Record<string, string> = {};

      // Add all supported locales except English
      SUPPORTED_LOCALES.filter((locale) => locale !== 'en').forEach(
         (locale) => {
            languagesMap[locale] = absoluteUrl(`/${locale}/contact`);
         },
      );

      // Use SEO data from CMS if available, otherwise use default metadata
      const metadata: Metadata = {
         title: seo?.metaTitle || 'Contact Us | UnivDatos',
         description:
            seo?.metaDescription ||
            'Get in touch with UnivDatos. Contact us for inquiries, support, or collaboration opportunities.',

         openGraph: {
            title:
               seo?.metaSocial?.find(
                  (social: any) => social.socialNetwork === 'facebook',
               )?.title ||
               seo?.metaTitle ||
               'Contact Us | UnivDatos',
            description:
               seo?.metaSocial?.find(
                  (social: any) => social.socialNetwork === 'facebook',
               )?.description ||
               seo?.metaDescription ||
               'Get in touch with UnivDatos. Contact us for inquiries, support, or collaboration opportunities.',
            type: 'website',
            url: absoluteUrl('/contact'),
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
                  alt: 'Contact UnivDatos',
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
               'Contact Us | UnivDatos',
            description:
               seo?.metaSocial?.find(
                  (social: any) => social.socialNetwork === 'twitter',
               )?.description ||
               seo?.metaDescription ||
               'Get in touch with UnivDatos. Contact us for inquiries, support, or collaboration opportunities.',
            images: [
               seo?.metaSocial?.find(
                  (social: any) => social.socialNetwork === 'twitter',
               )?.image?.url ||
                  seo?.metaImage?.url ||
                  absoluteUrl('/logo.png'),
            ],
         },

         keywords:
            seo?.keywords || 'Contact, UnivDatos, Support, Inquiries, Location',

         alternates: {
            canonical: seo?.canonicalURL || absoluteUrl('/contact'),
            languages: languagesMap,
         },

         other: {
            'script:ld+json': [
               JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'ContactPage',
                  name: 'UnivDatos Contact Page',
                  url: absoluteUrl('/contact'),
                  description:
                     'Get in touch with UnivDatos. Contact us for inquiries, support, or collaboration opportunities.',
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
         title: 'Contact Us | UnivDatos',
         description:
            'Get in touch with UnivDatos. Contact us for inquiries, support, or collaboration opportunities.',
         openGraph: {
            title: 'Contact Us | UnivDatos',
            description:
               'Get in touch with UnivDatos. Contact us for inquiries, support, or collaboration opportunities.',
            type: 'website',
         },
      };
   }
}

const Contact = async () => {
   let contactPageData: Awaited<ReturnType<typeof getContactPageData>>;

   try {
      contactPageData = await getContactPageData();
   } catch (error) {
      console.error('Error fetching main menu:', error);
   }

   if (!contactPageData) {
      return <div>Error fetching contact page data</div>;
   }
   let contactDetails = {
      contactSectionTitle:
         contactPageData?.data?.attributes?.contactSectionTitle,
      locationSectionTitle:
         contactPageData?.data?.attributes?.locationSectionTitle,
      locationSectionDescription:
         contactPageData?.data?.attributes?.locationSectionDescription,
      socialMediaSectionTitle:
         contactPageData?.data?.attributes?.socialMediaSectionTitle,
      contactFormTitle: contactPageData?.data?.attributes?.contactFormTitle,
      contactFormSubmitText:
         contactPageData?.data?.attributes?.contactFormSubmitText,
      contactDetailsList: contactPageData?.data?.attributes?.contactDetailsList,
      socialMediaSectionIconsList:
         contactPageData?.data?.attributes?.socialMediaSectionIconsList,
      contactFormFields: contactPageData?.data?.attributes?.contactFormFields,
   };
   return (
      <div className='container pt-40'>
         <div className='my-10 flex flex-col-reverse items-start gap-6 md:gap-10 lg:flex-row'>
            <div className='w-full lg:w-max lg:flex-[0.4]'>
               <ContactDetails contactDetails={contactDetails} />
            </div>

            <div className='w-full lg:w-max lg:flex-[0.6]'>
               <ContactForm />
            </div>
         </div>
         <div className='mb-10 w-full overflow-hidden rounded-lg'>
            <iframe
               src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.105250042955!2d77.32551197642748!3d28.596619185708878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce4fc8229f2eb%3A0xd2f74545b7c6d686!2sunivdatos!5e0!3m2!1sen!2sin!4v1724409606048!5m2!1sen!2sin'
               className='aspect-[9/3] w-full border-0'
               allowFullScreen={true}
               loading='lazy'
               referrerPolicy='no-referrer-when-downgrade'
            ></iframe>
         </div>
      </div>
   );
};

export default Contact;
