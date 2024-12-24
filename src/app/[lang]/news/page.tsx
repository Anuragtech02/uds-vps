export const runtime = 'edge';
import NewsFilters from '@/components/News/NewsFilters';
import NewsItem from '@/components/News/NewsItem';
import Pagination from '@/components/ReportStore/Pagination';
import { getIndustries, getNewsListingPage } from '@/utils/api/services';

interface newsItem {
   id: number;
   title: string;
   shortDescrption: string;
   thumbnailImage: {
      url: string;
      altContent: string;
      width: number;
      height: number;
   };
   description: string;
   createdAt: string;
   publishedAt: string;
   oldPublishedAt: string;
   locale: string;
   slug: string;
}

interface industryItem {
   id: number;
   name: string;
   createdAt: string;
   publishedAt: string;
   slug: string;
}
const ITEMS_PER_PAGE = 10;

const News = async ({
   searchParams,
}: {
   searchParams: any;
}) => {
   const industryFilters =
   searchParams.industries?.split(',').filter(Boolean) || [];
   const geographyFilters =
      searchParams.geographies?.split(',').filter(Boolean) || [];
   const currentPage = parseInt(searchParams.page || '1', 10);

   const filters = industryFilters.concat(geographyFilters);
   const filtersQuery = filters.reduce(
      (acc: any, filter: any) => {
         if (industryFilters.includes(filter)) {
            acc[`industriesSlug_${filter}`] = filter;
         } else if (geographyFilters.includes(filter)) {
            acc[`geograpriesSlug_${filter}`] = filter;
         }
         return acc;
      },
      {} as Record<string, string>,
   );


   const [newsListData, industriesData] = await Promise.all([
      getNewsListingPage(currentPage, ITEMS_PER_PAGE, filtersQuery)
      .catch((error) => {
         console.error('Error fetching news:', error);
         return null;
      }),
      getIndustries().catch((error) => {
         console.error('Error fetching industries:', error);
         return null;
      }) ]);

   const totalItems = newsListData?.meta?.pagination?.total || 0;
   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

   const newsList =
      newsListData?.data?.map(
         (
            news: { attributes: newsItem; id: number },
            idx: number,
         ): newsItem => ({
            id: news?.id ?? idx,
            title: news?.attributes?.title ?? '',
            shortDescrption: news?.attributes?.shortDescrption ?? '',

            thumbnailImage:
               // @ts-ignore
               news?.attributes?.thumbnailImage?.data?.attributes ?? '',
            description: news?.attributes?.description ?? '',
            createdAt: news?.attributes?.createdAt ?? '',
            publishedAt: news?.attributes?.publishedAt ?? '',
            oldPublishedAt: news?.attributes?.oldPublishedAt ?? '',
            locale: news?.attributes?.locale ?? '',
            slug: news?.attributes?.slug ?? '',
         }),
      ) ?? [];

   return (
      <div className='container pt-40'>
         <h1 className='mt-5 text-center font-bold'>News</h1>
         <div className='my-10 flex flex-col items-start gap-6 lg:flex-row'>
            <div className='w-full lg:sticky lg:top-48 lg:w-[350px]'>
               <NewsFilters industries={industriesData?.data} filters={filters} />
            </div>
            <div className='grid flex-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3'>
               {newsList?.length > 0 ? (
                  newsList?.map((news: newsItem, i: number) => (
                     <NewsItem
                        key={i}
                        title={news?.title}
                        thumbnailImage={news?.thumbnailImage}
                        date={new Intl.DateTimeFormat('en-IN', {
                           day: '2-digit',
                           month: 'short',
                           year: 'numeric',
                        }).format(new Date(news?.oldPublishedAt || news?.publishedAt))}
                        slug={news?.slug}
                     />
                  ))
               ) : (
                  <p className='rounded bg-gray-100 p-4 text-2xl font-bold text-gray-600'>
                     No News Article found
                  </p>
               )}
            </div>
         </div>
         {totalPages > 1 && (
            <Pagination
               searchParams={searchParams}
               currentPage={currentPage}
               totalPages={totalPages}
            />
         )}
      </div>
   );
};

export default News;
