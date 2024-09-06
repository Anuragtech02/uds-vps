import AboutCta from '@/components/About/AboutCta';
import AboutData from '@/components/About/AboutData';
import Hero from '@/components/About/Hero';

import MediaCitation from '@/components/commons/MediaCitation';

const About = () => {
   return (
      <>
         <Hero />
         <AboutData />
         <MediaCitation />
         <AboutCta />
      </>
   );
};

export default About;
