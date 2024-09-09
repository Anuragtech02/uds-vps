import Link from 'next/link';
import NewsItem from '../News/NewsItem';

const NewsResults = ({ news }: any) => {
   return (
      <div>
         {news.map((item: any) => {
            return (
               <Link href={`/news/${item?.slug}`} key={item.id}>
                  <NewsItem
                     key={item.id}
                     thumbnailImage={item?.thumbnailImage}
                     title={item?.title}
                     date={new Date(item?.publishedAt).toDateString()}
                  />
               </Link>
            );
         })}
         {news.length === 0 && <p>No news articles found</p>}
      </div>
   );
};

export default NewsResults;
