import BlogBody from '@/components/Blog/BlogBody';
import BlogSidebar from '@/components/Blog/BlogSidebar';
import Header from '@/components/Blog/Header';
import { IoIosSearch } from 'react-icons/io';

const Blog = () => {
   return (
      <div className='bg-s-50'>
         <div className='mt-40' />
         <Header />
         <div className='container'>
            <div className='flex flex-col gap-6 py-12 md:flex-row md:gap-10 md:py-20'>
               <div className='flex-[0.7]'>
                  <BlogBody />
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
                  <BlogSidebar />
               </div>
            </div>
         </div>
      </div>
   );
};

export default Blog;
