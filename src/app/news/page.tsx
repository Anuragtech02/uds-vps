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
   let newsListData: Awaited<ReturnType<typeof getNewsListingPage>>;
   let industriesData: Awaited<ReturnType<typeof getIndustries>>;

   try {
      [newsListData, industriesData] = await Promise.all([
         getNewsListingPage(),
         getIndustries(),
      ]);
   } catch (error) {
      console.error('Error fetching blogs or industries:', error);
   }

   const newsList = newsListData?.data?.map(
      (news: { attributes: newsItem; id: number }, idx: number): newsItem => ({
         id: news?.id ?? idx,
         title: news?.attributes?.title ?? '',
         shortDescrption: news?.attributes?.shortDescrption ?? '',
         description: news?.attributes?.description ?? '',
         createdAt: news?.attributes?.createdAt ?? '',
         publishedAt: news?.attributes?.publishedAt ?? '',
         locale: news?.attributes?.locale ?? '',
      }),
   );

   const industries = industriesData?.data?.map(
      (
         industry: { attributes: industryItem; id: number },
         idx: number,
      ): industryItem => ({
         id: industry?.id ?? idx,
         name: industry?.attributes?.name ?? '',
         createdAt: industry?.attributes?.createdAt ?? '',
         publishedAt: industry?.attributes?.publishedAt ?? '',
         slug: industry?.attributes?.slug ?? '',
      }),
   );

   if (!newsList || !industries) {
      console.error(
         'Error fetching blogs or industries: Data is null or undefined',
      );
      return <div>Error fetching data</div>;
   }

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
