// export const runtime = 'edge';
import MediaCitation from '@/components/commons/MediaCitation';
import Hero from '@/components/Home/Hero';
import LatestResearch from '@/components/Home/LatestResearch';

import NewsRoom from '@/components/Home/NewsRoom';
import Testimonials from '@/components/Home/Testimonials';
import UpcomingReports from '@/components/Home/UpcomingReports';

import {
   getAllReports,
   getBlogsListingPage,
   getHomePage,
   getNewsListingPage,
} from '@/utils/api/services';
import { Metadata } from 'next';
import RecentResearch from '@/components/Home/RecentResearch';
import { getRecentReports } from '@/utils/cache-recent-reports.utils';

export async function generateMetadata({
   params,
}: {
   params: {
      slug: string;
   };
}): Promise<Metadata> {
   const homePage = await getHomePage();

   return {
      title: homePage.data.attributes.heroMainHeading,
      description: homePage.data.attributes.heroMainHeading,
      // openGraph: {
      //    images: [reportPage.attributes.highlightImage.data.attributes.url],
      // },
   };
}

async function Home() {
   let homePage: Awaited<ReturnType<typeof getHomePage>>;
   let upcomingReports: Awaited<ReturnType<typeof getAllReports>>;
   let latestReports: Awaited<ReturnType<typeof getAllReports>>;
   let latestBlogs: Awaited<ReturnType<typeof getBlogsListingPage>>;
   let latestNewsArticles: Awaited<ReturnType<typeof getNewsListingPage>>;

   try {
      [
         homePage,
         upcomingReports,
         latestReports,
         latestBlogs,
         latestNewsArticles,
      ] = await Promise.all([
         getHomePage(),
         getAllReports(1, 10, {
            status: 'UPCOMING',
         }),
         getAllReports(1, 10, {
            status: 'LIVE',
         }),
         getBlogsListingPage(1, 1),
         getNewsListingPage(1, 3),
      ]);
   } catch (error) {
      console.error('Error fetching upcoming reports:', error);
   }

   const mediaCitation = {
      mediaSectionTitle: homePage?.data?.attributes?.mediaSectionHeading,
      mediaSectionDescription:
         homePage?.data?.attributes?.mediaSectionDescription,
      mediaSecrtionLogos:
         homePage?.data?.attributes?.mediaSectionLogos.data?.map(
            (img: any) => img.attributes,
         ),
   };

   const upcomingReportList = upcomingReports?.data?.map((report: any) => ({
      id: report?.id,
      slug: report?.attributes?.slug,
      title: report?.attributes?.title,
      shortDescription: report?.attributes?.shortDescription,
      publishedAt: report?.attributes?.publishedAt,
      highlightImage: report?.attributes?.highlightImage?.data?.attributes,
   }));

   const latestReportList = latestReports?.data?.map((report: any) => ({
      id: report?.id,
      slug: report?.attributes?.slug,
      title: report?.attributes?.title,
      shortDescription: report?.attributes?.shortDescription,
      publishedAt: report?.attributes?.publishedAt,
      highlightImage: report?.attributes?.highlightImage?.data?.attributes,
   }));

   return (
      <>
         <Hero data={homePage} />
         <RecentResearch data={homePage} />
         <Testimonials data={homePage} />
         <LatestResearch
            data={homePage}
            reports={latestReportList}
            upcomingReports={upcomingReportList}
         />
         <MediaCitation mediaCitation={mediaCitation} />
         <UpcomingReports
            data={{ upcomingReports: upcomingReportList, homePage }}
         />
         <NewsRoom
            data={{
               blogs: latestBlogs?.data?.map((blog: any) => blog.attributes),
               newsArticles: latestNewsArticles?.data?.map(
                  (newsArticle: any) => newsArticle.attributes,
               ),
            }}
         />
      </>
   );
}

export default function Page() {
   return <Home />;
}
