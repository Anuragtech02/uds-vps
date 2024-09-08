import NewsBody from '@/components/News/NewsBody';
import NewsSidebar from '@/components/News/NewsSidebar';
import Header from '@/components/News/Header';
import { IoIosSearch } from 'react-icons/io';
import { getNewsBySlug } from '@/utils/api/services';

const News = async ({data}: any) => {
   const { slug } = data?.params;
   console.log(slug, 'here');
   let newsArticle: Awaited<ReturnType<typeof getNewsBySlug>>;

   try {
      newsArticle = await getNewsBySlug(slug);
   } catch (error) {
      console.error('Error fetching blog details:', error);
   }

   if (!newsArticle?.data?.length) {
      return <p>Not found</p>;
   }
   let blog = newsArticle?.data?.[0]?.attributes;
   return (
      <div className='bg-s-50'>
         <div className='mt-40' />
         <Header />
         <div className='container'>
            <div className='flex flex-col gap-6 py-12 md:flex-row md:gap-10 md:py-20'>
               <div className='flex-[0.7]'>
                  <NewsBody newsArticle={newsArticle} />
               </div>
               <div className='flex-[0.3] space-y-4 md:space-y-6'>
                  <div className='flex items-center gap-3 rounded-full border border-blue-2 px-6 py-3'>
                     <span className='text-2xl'>
                        <IoIosSearch />
                     </span>
                     <input
                        type='text'
                        placeholder='Search for reports, industries and more...'
                        className='w-full bg-transparent text-[1.125rem] outline-none'
                     />
                  </div>
                  <NewsSidebar />
               </div>
            </div>
         </div>
      </div>
   );
};

export default News;
