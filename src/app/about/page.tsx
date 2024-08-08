import AboutCta from '@/components/About/AboutCta';
import AboutData from '@/components/About/AboutData';
import Hero from '@/components/About/Hero';
import OrderProcess from '@/components/About/OrderProcess';

import MediaCitation from '@/components/commons/MediaCitation';

const About = () => {
   return (
      <>
         <Hero />
         <AboutData />
         <MediaCitation />
         <OrderProcess />
         <AboutCta />
      </>
   );
};

export default About;
