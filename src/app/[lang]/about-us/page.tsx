// export const runtime = 'edge';
import AboutCta from '@/components/About/AboutCta';
import AboutData from '@/components/About/AboutData';
import Hero from '@/components/About/Hero';

import MediaCitation from '@/components/commons/MediaCitation';
import { getAboutPage } from '@/utils/api/services';
import { SUPPORTED_LOCALES } from '@/utils/constants';
import { absoluteUrl } from '@/utils/generic-methods';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
   try {
      const aboutData = await getAboutPage();
      const { attributes } = aboutData.data;
      const seo = attributes?.seo;

      // Create languages map for alternates
      const languagesMap: Record<string, string> = {};

      // Add all supported locales except English
      SUPPORTED_LOCALES.filter((locale) => locale !== 'en').forEach(
         (locale) => {
            languagesMap[locale] = absoluteUrl(`/${locale}/about`);
         },
      );

      const metadata: Metadata = {
         title: seo?.metaTitle || 'About UnivDatos',
         description: seo?.metaDescription || attributes?.heroHeading,

         openGraph: {
            title:
               seo?.metaSocial?.find(
                  (social: any) => social.socialNetwork === 'facebook',
               )?.title ||
               seo?.metaTitle ||
               'About UnivDatos',
            description:
               seo?.metaSocial?.find(
                  (social: any) => social.socialNetwork === 'facebook',
               )?.description ||
               seo?.metaDescription ||
               attributes?.heroHeading,
            type: 'website',
            url: absoluteUrl('/about'),
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
                  alt: 'About UnivDatos',
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
               'About UnivDatos',
            description:
               seo?.metaSocial?.find(
                  (social: any) => social.socialNetwork === 'twitter',
               )?.description ||
               seo?.metaDescription ||
               attributes?.heroHeading,
            images: [
               seo?.metaSocial?.find(
                  (social: any) => social.socialNetwork === 'twitter',
               )?.image?.url ||
                  seo?.metaImage?.url ||
                  absoluteUrl('/logo.png'),
            ],
         },

         keywords: seo?.keywords || 'About, UnivDatos, Research, Data',

         alternates: {
            canonical: seo?.canonicalURL || absoluteUrl('/about'),
            languages: languagesMap,
         },

         other: {
            'script:ld+json': [
               JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Organization',
                  name: 'UnivDatos',
                  url: absoluteUrl('/about'),
                  logo: absoluteUrl('/logo.png'),
                  description: attributes?.heroHeading,
                  sameAs: [
                     'https://twitter.com/univdatos',
                     'https://www.linkedin.com/company/univdatos',
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
   } catch (error) {
      console.error('Error generating metadata:', error);
      // Return default metadata if there's an error
      return {
         title: 'About UnivDatos',
         description: 'Learn about UnivDatos and our mission.',
      };
   }
}

interface heroItem {
   heroHeading: string;
   heroPrimaryCTAButton: {
      title: string;
      link: string;
      id: number;
   };
   heroSecondaryCTAButton: {
      title: string;
      link: string;
      id: number;
   };
}
const About = async () => {
   let data: Awaited<ReturnType<typeof getAboutPage>>;

   try {
      data = await getAboutPage();
   } catch (error) {
      console.error('Error fetching about page:', error);
   }

   if (!data) {
      console.error('Error fetching about page: Data is null or undefined');
      return <div>Error fetching data</div>;
   }

   const hero: heroItem = {
      heroHeading: data.data?.attributes?.heroHeading ?? '',
      heroPrimaryCTAButton: data.data?.attributes?.heroPrimaryCTAButton ?? {},
      heroSecondaryCTAButton:
         data.data?.attributes?.heroSecondaryCTAButton ?? {},
   };
   const about = {
      researchSectionTitle: data.data?.attributes?.researchSectionTitle ?? '',
      researchSectionSubtitle:
         data.data?.attributes?.researchSectionSubtitle ?? '',
      researchSectionDescription:
         data.data?.attributes?.researchSectionDescription ?? '',
      researchSectionImage:
         data.data?.attributes?.researchSectionImage?.data?.attributes ?? {},
      visionMissionCards: data.data?.attributes?.visionMissionCards ?? [],
      visionMissionDescription:
         data.data?.attributes?.visionMissionDescription ?? '',
   };
   const ctaBanner = data.data?.attributes?.ctaBanner ?? {};

   const mediaCitation = {
      mediaSectionTitle: data.data?.attributes?.mediaSectionTitle ?? '',
      mediaSectionDescription:
         data.data?.attributes?.mediaSectionDescription ?? '',
      mediaSecrtionLogos:
         data.data?.attributes?.mediaSecrtionLogos?.data?.map((logo: any) => ({
            id: logo?.id,
            ...logo?.attributes,
         })) ?? [],
   };

   return (
      <>
         <Hero hero={hero} />
         <AboutData about={about} />
         <MediaCitation mediaCitation={mediaCitation} />
         <AboutCta ctaBanner={ctaBanner} />
      </>
   );
};

// export default About;

export default function Page() {
   return <About />;
}
