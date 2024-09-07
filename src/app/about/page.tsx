import AboutCta from '@/components/About/AboutCta';
import AboutData from '@/components/About/AboutData';
import Hero from '@/components/About/Hero';

import MediaCitation from '@/components/commons/MediaCitation';
import { getAboutPage } from '@/utils/api/services';
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
   const res = await getAboutPage();
   const hero: heroItem = {
      heroHeading: res?.data?.attributes?.heroHeading,
      heroPrimaryCTAButton: res?.data?.attributes?.heroPrimaryCTAButton,
      heroSecondaryCTAButton: res?.data?.attributes?.heroSecondaryCTAButton,
   };
   const about = {
      researchSectionTitle: res?.data?.attributes?.researchSectionTitle,
      researchSectionSubtitle: res?.data?.attributes?.researchSectionSubtitle,
      researchSectionDescription:
         res?.data?.attributes?.researchSectionDescription,
      researchSectionImage:
         res?.data?.attributes?.researchSectionImage?.data?.attributes,
      visionMissionCards: res?.data?.attributes?.visionMissionCards,
      visionMissionDescription: res?.data?.attributes?.visionMissionDescription,
   };
   const ctaBanner = res?.data?.attributes?.ctaBanner;
   const mediaCitation = {
      mediaSectionTitle: res?.data?.attributes?.mediaSectionTitle,
      mediaSectionDescription: res?.data?.attributes?.mediaSectionDescription,
      mediaSecrtionLogos: res?.data?.attributes?.mediaSecrtionLogos?.data?.map(
         (logo: any) => ({ id: logo?.id, ...logo?.attributes }),
      ),
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

export default About;
