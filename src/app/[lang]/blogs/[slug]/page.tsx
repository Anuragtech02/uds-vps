export const runtime = 'edge';
import BlogBody from '@/components/Blog/BlogBody';
import BlogSidebar from '@/components/Blog/BlogSidebar';
import Header from '@/components/Blog/Header';
import ClientSearchHero from '@/components/Home/ClientSearchHero';
import { getBlogDetails } from '@/utils/api/services';
import { IoIosSearch } from 'react-icons/io';

const Blog = async (data: any) => {
   const { slug } = data?.params;
   let blogDetails: Awaited<ReturnType<typeof getBlogDetails>>;

   try {
      blogDetails = await getBlogDetails(slug);
   } catch (error) {
      console.error('Error fetching blog details:', error);
   }

   if (!blogDetails?.data?.length) {
      return <p>Not found</p>;
   }
   let blog = blogDetails?.data?.[0]?.attributes;
   return (
      <div className='bg-s-50'>
         <div className='mt-0' />
         <Header blog={blog} />
         <div className='container'>
            <div className='flex flex-col gap-6 py-12 md:gap-10 md:py-20 lg:flex-row'>
               <div className='flex-[0.7]'>
                  <BlogBody blog={blog} />
               </div>
               <div className='flex-[0.3] space-y-4 md:space-y-6'>
                  <div className='w-full [&>div]:w-full'>
                     <ClientSearchHero />
                  </div>
                  <BlogSidebar />
               </div>
            </div>
         </div>
      </div>
   );
};

export default Blog;
