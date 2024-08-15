import BlogFilters from '@/components/Blog/BlogFilters';
import BlogItem from '@/components/Blog/BlogItem';

const Blog = () => {
   return (
      <div className='container pt-40'>
         <div className='my-10 flex gap-6'>
            <BlogFilters />
            <div className='flex-[0.7] space-y-6'>
               {Array.from({ length: 10 }).map((_, i) => (
                  <BlogItem
                     key={i}
                     title='Lorem ipsum dolor sit amet consectetur adipisicing elit.'
                     date='12th June 2021'
                  />
               ))}
            </div>
         </div>
      </div>
   );
};

export default Blog;
