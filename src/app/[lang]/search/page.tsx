// export const runtime = 'edge';
import GetCallBackForm from '@/components/commons/GetCallBackForm';
import ClientSearchHero from '@/components/Home/ClientSearchHero';
import Pagination from '@/components/ReportStore/Pagination';
import SearchFilterBar from '@/components/Search/SearchFilterBar';
import SearchResults from '@/components/Search/SearchResults';
import { getGeographies, getIndustries } from '@/utils/api/services';
import { LOGO_URL_DARK, SEARCH_IMAGE_URL } from '@/utils/constants';
import { absoluteUrl } from '@/utils/generic-methods';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { BiLoaderCircle } from 'react-icons/bi';

export async function generateMetadata({
   searchParams,
   params,
}: {
   searchParams: { q?: string };
   params: any;
}): Promise<Metadata> {
   const searchQuery = searchParams?.q || '';
   const { lang: locale } = params;

   const title = searchQuery
      ? `${TRANSLATED_VALUES[locale]?.commons.searchResultsFor + ' ' + searchQuery} - UnivDatos ${TRANSLATED_VALUES[locale]?.commons.marketResearch}`
      : `${TRANSLATED_VALUES[locale]?.commons?.searchMarketResearch} - UnivDatos'`;

   const description = searchQuery
      ? `${TRANSLATED_VALUES[locale]?.commons.findMarketResearchReports.replace('<QUERY>', searchQuery)}`
      : `${TRANSLATED_VALUES[locale]?.commons?.searchThrough}`;

   return {
      title,
      description,

      openGraph: {
         title,
         description,
         type: 'website',
         url: absoluteUrl(
            `/${locale}/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`,
         ),
         images: [
            {
               url: SEARCH_IMAGE_URL,
               width: 1200,
               height: 630,
               alt: 'UnivDatos Market Research Search',
            },
         ],
         siteName: 'UnivDatos',
      },

      twitter: {
         card: 'summary_large_image',
         title,
         description,
         images: [SEARCH_IMAGE_URL],
      },

      keywords:
         'market research search, industry reports search, market analysis, research reports, business intelligence, industry trends, market data',

      alternates: {
         canonical: absoluteUrl(
            `/${locale}/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`,
         ),
      },

      other: {
         'script:ld+json': [
            JSON.stringify({
               '@context': 'https://schema.org',
               '@type': 'SearchResultsPage',
               name: title,
               description,
               url: absoluteUrl(
                  `/${locale}/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`,
               ),
               publisher: {
                  '@type': 'Organization',
                  name: 'UnivDatos',
                  logo: {
                     '@type': 'ImageObject',
                     url: LOGO_URL_DARK,
                  },
               },
               potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                     '@type': 'EntryPoint',
                     urlTemplate: absoluteUrl('/search?q={search_term_string}'),
                  },
                  'query-input': 'required name=search_term_string',
               },
            }),
         ],
      },
   };
}

const ITEMS_PER_PAGE = 10;

interface SearchParams {
   industries?: string;
   geographies?: string;
   page?: string;
   viewType?: string;
   sortBy?: string;
   q?: string;
}

interface SearchListProps {
   searchParams: SearchParams;
   params: {
      lang: string;
   };
}

const Search: React.FC<SearchListProps> = async ({ searchParams, params }) => {
   const currentPage = parseInt(searchParams.page || '1', 10);

   const [industries, geographies] = await Promise.all([
      getIndustries(),
      getGeographies(),
   ]);

   const currentFilters = [
      ...(searchParams.industries?.split(',').filter(Boolean) || []),
      ...(searchParams.geographies?.split(',').filter(Boolean) || []),
   ];

   return (
      <div className='container pt-40'>
         <div className='mt-10'>
            <SearchFilterBar
               industries={industries}
               geographies={geographies}
               currentFilters={currentFilters}
               searchQuery={searchParams.q}
               sortBy={searchParams.sortBy}
               locale={params.lang}
            />

            <div className='flex flex-col items-start gap-6 md:flex-row md:gap-10'>
               <div className='flex-[0.6] space-y-4 md:space-y-6'>
                  <p className='text-[1.75rem] font-semibold text-s-500'>
                     {TRANSLATED_VALUES[params?.lang]?.commons.searchResultsFor}
                     : &quot;{searchParams?.q}&quot;
                  </p>

                  <Suspense
                     fallback={
                        <div className='flex h-32 items-center justify-center'>
                           <BiLoaderCircle className='h-8 w-8 animate-spin text-gray-400' />
                        </div>
                     }
                  >
                     <SearchResults />
                  </Suspense>
               </div>

               <div className='flex-[0.4] space-y-4 md:space-y-6'>
                  <div className='bg-white [&>div]:w-full sm:[&>div]:w-auto'>
                     <GetCallBackForm />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Search;
