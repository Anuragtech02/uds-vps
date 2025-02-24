// export const runtime = 'edge';
import AllServices from '@/components/Services/AllServices';
import Hero from '@/components/Services/Hero';
import { getServicesPage, getAllServices } from '@/utils/api/services';
import { SUPPORTED_LOCALES } from '@/utils/constants';
import { absoluteUrl } from '@/utils/generic-methods';
import { Metadata } from 'next';

// Function to sanitize HTML strings
function stripHtml(html: string): string {
   if (!html) return '';
   return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with spaces
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim(); // Remove leading/trailing spaces
}

export async function generateMetadata(): Promise<Metadata> {
   const pageData = await getServicesPage();
   const attributes = pageData?.data?.attributes;
   const seo = attributes?.seo;

   // Sanitize content for meta tags
   const sanitizedHeading = stripHtml(attributes?.heroSectionHeading || '');
   const sanitizedDescription = stripHtml(
      attributes?.heroSectionDescription || '',
   );

   const languagesMap: Record<string, string> = {};

   SUPPORTED_LOCALES.filter((locale) => locale !== 'en').forEach((locale) => {
      languagesMap[locale] = absoluteUrl(`/${locale}/services`);
   });

   // Sanitize social media content
   const facebookSocial = seo?.metaSocial?.find(
      (social: any) => social.socialNetwork === 'facebook',
   );
   const twitterSocial = seo?.metaSocial?.find(
      (social: any) => social.socialNetwork === 'twitter',
   );

   const metadata: Metadata = {
      title: stripHtml(seo?.metaTitle) || sanitizedHeading || 'Our Services',
      description:
         stripHtml(seo?.metaDescription) ||
         sanitizedDescription ||
         'Explore our services',

      openGraph: {
         title:
            stripHtml(facebookSocial?.title) ||
            stripHtml(seo?.metaTitle) ||
            sanitizedHeading,
         description:
            stripHtml(facebookSocial?.description) ||
            stripHtml(seo?.metaDescription) ||
            sanitizedDescription,
         type: 'website',
         url: absoluteUrl('/services'),
         images: [
            {
               url:
                  facebookSocial?.image?.url ||
                  seo?.metaImage?.url ||
                  '/default-service-image.jpg',
               width: 1200,
               height: 630,
               alt: sanitizedHeading || 'Our Services',
            },
         ],
         siteName: 'Your Company Name',
      },

      twitter: {
         card: 'summary_large_image',
         title:
            stripHtml(twitterSocial?.title) ||
            stripHtml(seo?.metaTitle) ||
            sanitizedHeading,
         description:
            stripHtml(twitterSocial?.description) ||
            stripHtml(seo?.metaDescription) ||
            sanitizedDescription,
         images: [
            twitterSocial?.image?.url ||
               seo?.metaImage?.url ||
               '/default-service-image.jpg',
         ],
      },

      keywords:
         stripHtml(seo?.keywords) ||
         'services, solutions, professional services',

      alternates: {
         canonical: seo?.canonicalURL || absoluteUrl('/services'),
         languages: languagesMap,
      },

      other: {
         'script:ld+json': [
            JSON.stringify({
               '@context': 'https://schema.org',
               '@type': 'Service',
               name: sanitizedHeading,
               description: sanitizedDescription,
               provider: {
                  '@type': 'Organization',
                  name: 'Your Company Name',
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

   if (seo?.extraScripts) {
      metadata.other = {
         ...metadata.other,
         ...seo.extraScripts,
      };
   }

   return metadata;
}

const Services = async () => {
   let data: Awaited<ReturnType<typeof getServicesPage>>;
   let allServicesList: Awaited<ReturnType<typeof getAllServices>>;

   try {
      [data, allServicesList] = await Promise.all([
         getServicesPage(),
         getAllServices(),
      ]);
   } catch (error) {
      console.error('Error fetching about page:', error);
   }

   const hero = {
      heroSectionHeading: data?.data?.attributes?.heroSectionHeading ?? '',
      heroSectionDescription:
         data?.data?.attributes?.heroSectionDescription ?? '',
   };

   const servicesList = allServicesList?.data
      ?.map((service: any) => ({
         id: service?.id,
         slug: service?.attributes?.slug,
         title: service?.attributes?.title,
         description: service?.attributes?.description,
         shortDescription: service?.attributes?.shortDescription,
         image:
            service?.attributes?.highlightImage?.data?.attributes?.formats
               ?.small?.url ||
            service?.attributes?.highlightImage?.data?.attributes?.url,
      }))
      .sort((a: any, b: any) => a.id - b.id);

   return (
      <>
         <Hero hero={hero} services={servicesList} />
         <AllServices services={servicesList} />
      </>
   );
};

export default Services;
