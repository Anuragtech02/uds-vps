export const runtime = 'edge';
import NewsBody from '@/components/News/NewsBody';
import NewsSidebar from '@/components/News/NewsSidebar';
import Header from '@/components/News/Header';
import { getNewsBySlug } from '@/utils/api/services';
import ClientSearchHero from '@/components/Home/ClientSearchHero';

const News = async (props: any) => {
   const { slug } = props?.params;
   let newsArticle: Awaited<ReturnType<typeof getNewsBySlug>>;

   try {
      newsArticle = await getNewsBySlug(slug);
   } catch (error) {
      console.error('Error fetching blog details:', error);
   }

   if (!newsArticle?.data?.length) {
      return <p>Not found</p>;
   }
   let newsArticleData = newsArticle?.data?.[0]?.attributes;
   return (
      <div className='bg-s-50'>
         <div className='mt-0' />
         <Header newsArticle={newsArticleData} />
         <div className='container'>
            <div className='flex flex-col gap-6 py-12 md:gap-10 md:py-20 lg:flex-row'>
               <div className='flex-[0.7]'>
                  <NewsBody newsArticle={newsArticleData} />
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
