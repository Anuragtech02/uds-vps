import MediaCitation from '@/components/commons/MediaCitation';
import Hero from '@/components/Home/Hero';
import LatestResearch from '@/components/Home/LatestResearch';

import NewsRoom from '@/components/Home/NewsRoom';
import Testimonials from '@/components/Home/Testimonials';
import UpcomingReports from '@/components/Home/UpcomingReports';
import SearchWrapper from '@/components/Search/SearchWrapper';

import { getHomePage } from '../utils/api/services';

export default async function Home() {
   const homePage = await getHomePage();

   return (
      <>
         <Hero data={homePage} />
         <LatestResearch data={homePage} />
         <Testimonials data={homePage} />
         <UpcomingReports data={homePage} />
         <MediaCitation data={homePage} />
         <NewsRoom data={homePage} />
      </>
   );
}
