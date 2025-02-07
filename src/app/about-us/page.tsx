// export const runtime = 'edge';

import AboutCta from '@/components/About/AboutCta';
import AboutData from '@/components/About/AboutData';
import Hero from '@/components/About/Hero';

import MediaCitation from '@/components/commons/MediaCitation';
import PageSwitchLoading from '@/components/PageSwitchLoading';
import { getAboutPage } from '@/utils/api/services';
import { Suspense } from 'react';
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
