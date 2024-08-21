import NewsFilters from '@/components/News/NewsFilters';
import NewsItem from '@/components/News/NewsItem';

const News = () => {
   return (
      <div className='container pt-40'>
         <h1 className='mt-5 text-center font-bold'>News</h1>
         <div className='my-10 flex items-start gap-6'>
            <NewsFilters />
            <div className='grid flex-[0.7] gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3'>
               {Array.from({ length: 10 }).map((_, i) => (
                  <NewsItem
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

export default News;
