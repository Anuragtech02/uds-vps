import Hero from '@/components/Home/Hero';
import LatestResearch from '@/components/Home/LatestResearch';
import MediaCitation from '@/components/Home/MediaCitation';
import NewsRoom from '@/components/Home/NewsRoom';
import Testimonials from '@/components/Home/Testimonials';
import UpcomingReports from '@/components/Home/UpcomingReports';

export default function Home() {
   return (
      <>
         <Hero />
         <LatestResearch />
         <Testimonials />
         <UpcomingReports />
         <MediaCitation />
         <NewsRoom />
      </>
   );
}
