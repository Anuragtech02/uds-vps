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
} from '../utils/api/services';
import { Metadata } from 'next';

export async function generateMetadata({
   params,
}: {
   params: {
      slug: string;
   };
}): Promise<Metadata> {
   const homePage = await getHomePage();

   return {
      title: homePage.attributes.heroMainHeading,
      description: homePage.attributes.heroMainHeading,
      // openGraph: {
      //    images: [reportPage.attributes.highlightImage.data.attributes.url],
      // },
   };
}

export default async function Page() {
   let homePage: Awaited<ReturnType<typeof getHomePage>>;
   let upcomingReports: Awaited<ReturnType<typeof getAllReports>>;
   let latestBlogs: Awaited<ReturnType<typeof getBlogsListingPage>>;
   let latestNewsArticles: Awaited<ReturnType<typeof getNewsListingPage>>;

   try {
      [homePage, upcomingReports, latestBlogs, latestNewsArticles] =
         await Promise.all([
            getHomePage(),
            getAllReports(),
            getBlogsListingPage(1, 1),
            getNewsListingPage(1, 3),
         ]);
      console.log(latestBlogs);
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
      thumbnailImage: report?.attributes?.thumbnailImage?.data?.attributes,
   }));

   return (
      <>
         <Hero data={homePage} />
         <LatestResearch data={homePage} />
         <Testimonials data={homePage} />
         <UpcomingReports
            data={{ upcomingReports: upcomingReportList, homePage }}
         />
         <MediaCitation mediaCitation={mediaCitation} />
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
