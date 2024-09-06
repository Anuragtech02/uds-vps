import NewsFilters from '@/components/News/NewsFilters';
import NewsItem from '@/components/News/NewsItem';
import { getIndustries, getNewsListingPage } from '@/utils/api/services';

interface newsItem {
   id: number;
   title: string;
   shortDescrption: string;
   description: string;
   createdAt: string;
   publishedAt: string;
   locale: string;
}

interface industryItem {
   id: number;
   name: string;
   createdAt: string;
   publishedAt: string;
   slug: string;
}

const News = async () => {
   const newsListData = await getNewsListingPage();
   console.log({ newsListData: newsListData.data[0] });
   const newsList = newsListData?.data?.map(
      (
         news: {
            attributes: newsItem;
            id: number;
         },
         idx: number,
      ) => {
         return {
            id: news?.id ?? idx,
            title: news?.attributes?.title ?? '',
            shortDescrption: news?.attributes?.shortDescrption ?? '',
            description: news?.attributes?.description ?? '',
            createdAt: news?.attributes?.createdAt ?? '',
            publishedAt: news?.attributes?.publishedAt ?? '',
            locale: news?.attributes?.locale ?? '',
         };
      },
   );
   console.log({ newsList });
   const industriesData = await getIndustries();
   console.log({ industries: industriesData?.data?.[0] });
   const industries = industriesData?.data?.map(
      (
         industry: {
            attributes: industryItem;
            id: number;
         },
         idx: number,
      ) => {
         return {
            id: industry?.id ?? idx,
            name: industry?.attributes?.name ?? '',
            createdAt: industry?.attributes?.createdAt ?? '',
            publishedAt: industry?.attributes?.publishedAt ?? '',
            slug: industry?.attributes?.slug ?? '',
         };
      },
   );
   return (
      <div className='container pt-40'>
         <h1 className='mt-5 text-center font-bold'>News</h1>
         <div className='my-10 flex items-start gap-6'>
            <NewsFilters industries={industries} />
            <div className='grid flex-[0.7] gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3'>
               {newsList?.map((news: newsItem, i: number) => (
                  <NewsItem
                     key={i}
                     title={news?.title}
                     date={new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                     }).format(new Date(news?.publishedAt))}
                  />
               ))}
            </div>
         </div>
      </div>
   );
};

export default News;
