import Link from 'next/link';
import NewsItem from '../News/NewsItem';

const NewsResults = ({ news }) => {
   return (
      <div>
         {news.map((item) => {
            return (
               <Link href={`/news/${item?.slug}`} key={item.id}>
                  <NewsItem
                     key={item.id}
                     title={item?.title}
                     date={new Date(item?.publishedAt).toDateString()}
                  />
               </Link>
            );
         })}
      </div>
   );
};

export default NewsResults;
