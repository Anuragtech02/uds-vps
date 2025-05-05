import Link from 'next/link';
import NewsItem from '../News/NewsItem';
import { LocalizedLink } from '../commons/LocalizedLink';
import { getFormattedDate } from '@/utils/generic-methods';

const NewsResults = ({ news, locale = 'en' }: any) => {
   return (
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
         {news.map((item: any) => {
            return (
               <NewsItem
                  key={item.id}
                  thumbnailImage={item?.thumbnailImage}
                  title={item?.title}
                  date={getFormattedDate(item, locale)}
                  slug={item?.slug}
                  locale={locale}
               />
            );
         })}
         {news.length === 0 && <p>No news articles found</p>}
      </div>
   );
};

export default NewsResults;
