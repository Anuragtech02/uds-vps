// export const runtime = 'edge';
import { LocalizedLink } from '@/components/commons/LocalizedLink';
import NewsFilters from '@/components/News/NewsFilters';
import NewsItem from '@/components/News/NewsItem';
import ViewToggle from '@/components/Report/ViewToggle';
import FilterBar from '@/components/ReportStore/FilterBar';
import Pagination from '@/components/ReportStore/Pagination';
import {
   getGeographies,
   getIndustries,
   getNewsListingPage,
} from '@/utils/api/services';
import { LOGO_URL_DARK } from '@/utils/constants';
import { absoluteUrl, getFormattedDate } from '@/utils/generic-methods';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';
import { Metadata } from 'next';
import Link from 'next/link';

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

interface SearchParams {
   industries?: string;
   geographies?: string;
   page?: string;
   viewType?: string;
   sortBy?: string;
}

export async function generateMetadata({
   params,
}: {
   params: any;
}): Promise<Metadata> {
   const { locale } = params;

   const title = 'Latest Market Research News & Industry Updates | UnivDatos';
   const description =
      'Stay informed with the latest market research news, industry updates, and sector developments. Get timely insights on market trends and business intelligence.';

   return {
      title,
      description,

      openGraph: {
         title,
         description,
         type: 'website',
         url: locale ? absoluteUrl(`/${locale}/news`) : absoluteUrl('/news'),
         images: [
            {
               url: LOGO_URL_DARK,
               width: 1200,
               height: 630,
               alt: 'UnivDatos Report Store',
            },
         ],
         siteName: 'UnivDatos',
      },

      twitter: {
         card: 'summary_large_image',
         title,
         description,
         images: [LOGO_URL_DARK],
      },

      keywords:
         'market research reports, industry analysis, market insights, research reports, business intelligence, industry trends, market data, sector analysis',

      alternates: {
         canonical: locale
            ? absoluteUrl(`/${locale}/blogs`)
            : absoluteUrl('/blogs'),
      },

      other: {
         'script:ld+json': [
            JSON.stringify({
               '@context': 'https://schema.org',
               '@type': 'CollectionPage',
               name: title,
               description,
               url: locale
                  ? absoluteUrl(`/${locale}/news`)
                  : absoluteUrl('/news'),
               publisher: {
                  '@type': 'Organization',
                  name: 'UnivDatos',
                  logo: {
                     '@type': 'ImageObject',
                     url: absoluteUrl('/logo.svg'),
                  },
               },
            }),
         ],
      },
   };
}

const News = async ({
   searchParams,
   params,
}: {
   searchParams: SearchParams;
   params: {
      lang: string;
   };
}) => {
   const viewType = searchParams.viewType || 'grid';
   const industryFilters =
      searchParams.industries?.split(',').filter(Boolean) || [];
   const geographyFilters =
      searchParams.geographies?.split(',').filter(Boolean) || [];
   const currentPage = parseInt(searchParams.page || '1', 10);
   const sortBy = searchParams.sortBy || 'oldPublishedAt:desc';

   const filters = industryFilters.concat(geographyFilters);
   const filtersQuery = filters.reduce(
      (acc, filter) => {
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
      getNewsListingPage({
         page: currentPage,
         limit: ITEMS_PER_PAGE,
         filters: filtersQuery,
         sortBy,
         locale: params.lang,
      }).catch((error) => {
         console.error('Error fetching news:', error);
         return null;
      }),
      getIndustries().catch((error) => {
         console.error('Error fetching industries:', error);
         return null;
      }),
      // getGeographies().catch((error) => {
      //    console.error('Error fetching geographies:', error);
      //    return null;
      // }),
   ]);

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
         <h1 className='mt-5 text-center font-bold'>
            {TRANSLATED_VALUES[params.lang]?.header.news}
         </h1>

         <FilterBar
            industries={industriesData?.data || []}
            geographies={[]}
            currentFilters={filters}
            sortBy={sortBy}
            redirectPath='/news'
            showGeographyFilter={false}
         />

         <div className='mb-10 mt-4 flex flex-col items-start justify-between gap-6 lg:min-h-[50vh]'>
            <div className='w-full flex-1'>
               {/* <div className='flex items-center justify-between'>
                  <Pagination
                     searchParams={searchParams}
                     currentPage={currentPage}
                     totalPages={totalPages}
                  />
                  <ViewToggle currentView={viewType} />
               </div> */}

               <div
                  className={`grid gap-4 ${
                     viewType === 'list'
                        ? 'grid-cols-1'
                        : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  }`}
               >
                  {newsList?.length > 0 ? (
                     newsList.map((news: newsItem) => (
                        <NewsItem
                           key={news.id}
                           title={news.title}
                           thumbnailImage={news.thumbnailImage}
                           date={getFormattedDate(news, params.lang)}
                           slug={news.slug}
                           viewType={viewType}
                        />
                     ))
                  ) : (
                     <p className='rounded bg-gray-100 p-4 text-2xl font-bold text-gray-600'>
                        No News Article found
                     </p>
                  )}
               </div>
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
