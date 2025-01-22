export const runtime = 'edge';
import NewsBody from '@/components/News/NewsBody';
import NewsSidebar from '@/components/News/NewsSidebar';
import Header from '@/components/News/Header';
import RelatedNews from '@/components/News/RelatedNews';
import { getNewsBySlug } from '@/utils/api/services';
import ClientSearchHero from '@/components/Home/ClientSearchHero';
import { redirect } from 'next/navigation';

const News = async (props: any) => {
   const { slug, locale } = props?.params;
   let newsArticle: Awaited<ReturnType<typeof getNewsBySlug>>;

   try {
      newsArticle = await getNewsBySlug(slug);
   } catch (error) {
      console.error('Error fetching news details:', error);
      redirect(`/${locale}/not-found`);
   }

   if (!newsArticle?.data?.length) {
      redirect(`/${locale}/not-found`);
   }

   let newsArticleData = newsArticle?.data?.[0]?.attributes;
   const currentNewsId = newsArticle?.data?.[0]?.id;
   const industries = newsArticleData?.industries;

   return (
      <div className='bg-s-50'>
         <div className='mt-0' />
         <Header newsArticle={newsArticleData} />
         <div className='container'>
            <div className='flex flex-col gap-6 py-12 md:gap-10 md:py-20 lg:flex-row'>
               <div className='flex-[0.7]'>
                  <NewsBody newsArticle={newsArticleData} />
                  {/* Client-side Related News Section */}
                  {industries?.data?.length > 0 && (
                     <RelatedNews
                        currentNewsId={currentNewsId}
                        industries={industries}
                     />
                  )}
               </div>
               <div className='flex-[0.3] space-y-4 md:space-y-6'>
                  <div className='w-full [&>div]:w-full'>
                     <ClientSearchHero />
                  </div>
                  <NewsSidebar />
               </div>
            </div>
         </div>
      </div>
   );
};

export default News;
