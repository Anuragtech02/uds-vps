import Link from 'next/link';
import NewsItem from '../News/NewsItem';
import { LocalizedLink } from '../commons/LocalizedLink';

const NewsResults = ({ news }: any) => {
   return (
      <div>
         {news.map((item: any) => {
            return (
                  <NewsItem
                     key={item.id}
                     thumbnailImage={item?.thumbnailImage}
                     title={item?.title}
                     date={new Date(item?.oldPublishedAt || item?.publishedAt).toDateString()}
                     slug={item?.slug}
                  />
            );
         })}
         {news.length === 0 && <p>No news articles found</p>}
      </div>
   );
};

export default NewsResults;
