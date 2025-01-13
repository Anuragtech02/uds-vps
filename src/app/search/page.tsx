export const runtime = 'edge';
import GetCallBackForm from '@/components/commons/GetCallBackForm';
import ClientSearchHero from '@/components/Home/ClientSearchHero';
import SearchResults from '@/components/Search/SearchResults';
import { LOGO_URL_DARK, SEARCH_IMAGE_URL } from '@/utils/constants';
import { absoluteUrl } from '@/utils/generic-methods';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { BiLoaderCircle } from 'react-icons/bi';

export async function generateMetadata({
   searchParams,
}: {
   searchParams: { q?: string };
}): Promise<Metadata> {
   const searchQuery = searchParams?.q || '';
   const title = searchQuery
      ? `Search Results for "${searchQuery}" - UnivDatos Market Research`
      : 'Search Market Research Reports - UnivDatos';

   const description = searchQuery
      ? `Find market research reports and industry analysis related to "${searchQuery}". Browse comprehensive research studies, market data, and business insights.`
      : 'Search through our extensive collection of market research reports, industry analysis, and business insights. Find the data you need to make informed decisions.';

   return {
      title,
      description,

      openGraph: {
         title,
         description,
         type: 'website',
         url: absoluteUrl(
            `/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`,
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
            `/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`,
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
                  `/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`,
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

const Search = (props: {
   searchParams: {
      q: string;
   };
}) => {
   const { searchParams } = props;

   return (
      <div className='container pt-40'>
         <div className='mt-10'>
            <div className='flex flex-col items-start gap-6 md:flex-row md:gap-10'>
               <div className='flex-[0.6] space-y-4 md:space-y-6'>
                  <p className='text-[1.75rem] font-semibold text-s-500'>
                     Search result for: &apos;{searchParams?.q}&apos;
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
                  <div className='w-full [&>div]:w-full'>
                     <ClientSearchHero />
                  </div>
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
