import { FC, Suspense } from 'react';
import ReportStoreItem from '@/components/ReportStore/ReportItem';
import {
   getAllReports,
   getIndustries,
   getGeographies,
} from '@/utils/api/services';
import ReportListLoading from '@/components/ReportStore/ReportListLoading';
import Pagination from '@/components/ReportStore/Pagination';
import ViewToggle from '@/components/Report/ViewToggle';
import { absoluteUrl } from '@/utils/generic-methods';
import { Metadata } from 'next';
import { LOGO_URL_DARK } from '@/utils/constants';
import FilterBar from '@/components/ReportStore/FilterBar';
import { Media } from '@/components/StrapiImage/StrapiImage';

// Define search params interface
interface SearchParams {
   industries?: string;
   geographies?: string;
   page?: string;
   viewType?: string;
   sortBy?: string;
}

// Define Report interface
interface Report {
   attributes: {
      slug: string;
      slugCopy: string;
      title: string;
      publishedAt: string;
      shortDescription: string;
      oldPublishedAt: string;
      highlightImage: {
         data: {
            attributes: Media;
         };
      };
   };
}

interface ReportStoreProps {
   searchParams: SearchParams;
}

export async function generateMetadata(): Promise<Metadata> {
   const title =
      'UnivDatos Report Store - Market Research Reports & Industry Analysis';
   const description =
      'Browse our comprehensive collection of market research reports, industry analysis, and insights across various sectors. Find detailed reports to drive your business decisions.';

   return {
      title,
      description,
      openGraph: {
         title,
         description,
         type: 'website',
         url: absoluteUrl('/reports'),
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
         canonical: absoluteUrl('/reports'),
      },
      other: {
         'script:ld+json': [
            JSON.stringify({
               '@context': 'https://schema.org',
               '@type': 'CollectionPage',
               name: title,
               description,
               url: absoluteUrl('/reports'),
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

// Generate static params for the most common filter combinations and pages
export async function generateStaticParams() {
   // Pre-render the first 5 pages of the most common views
   const pages = [1, 2, 3, 4, 5];

   // Get the most popular industries (you would need to determine these)
   const popularIndustries = ['healthcare', 'automotive', 'technology']; // Example values

   // Generate params for common combinations
   const params = [
      // Default view (no filters)
      { page: '1', viewType: 'list', sortBy: 'oldPublishedAt:desc' },
      { page: '1', viewType: 'grid', sortBy: 'oldPublishedAt:desc' },

      // Pages with no filters
      ...pages.map((page) => ({
         page: page.toString(),
         viewType: 'list',
         sortBy: 'oldPublishedAt:desc',
      })),

      // Popular industries (first page only)
      ...popularIndustries.map((industry) => ({
         page: '1',
         industries: industry,
         viewType: 'list',
         sortBy: 'oldPublishedAt:desc',
      })),
   ];

   return params;
}

const ITEMS_PER_PAGE = 10;

// Define cache expiry time in seconds
const CACHE_EXPIRY_TIME = 3600; // Cache expires after 1 hour

// Define a cache for storing pre-fetched data with expiration
interface CacheEntry<T> {
   data: T;
   expiresAt: number;
}

let reportCache = new Map<string, CacheEntry<any>>();

interface CacheResponse {
   data: Array<{
      attributes: {
         name: string;
         slug: string;
      };
   }>;
}

let industriesCache: CacheEntry<CacheResponse> | null = null;
let geographiesCache: CacheEntry<CacheResponse> | null = null;

const ReportStore: FC<ReportStoreProps> = async ({ searchParams }) => {
   const viewType = searchParams.viewType || 'list';
   const industryFilters =
      searchParams.industries?.split(',').filter(Boolean) || [];
   const geographyFilters =
      searchParams.geographies?.split(',').filter(Boolean) || [];
   const currentPage = parseInt(searchParams.page || '1', 10);
   const sortBy = searchParams.sortBy || 'oldPublishedAt:desc';

   // Create a cache key based on the current filters and pagination
   const cacheKey = `${currentPage}_${sortBy}_${industryFilters.join('_')}_${geographyFilters.join('_')}`;

   // Get current timestamp for cache expiry checks
   const now = Date.now();

   // Process filters for the API query
   const filters = industryFilters.concat(geographyFilters);
   const filtersQuery = filters.reduce(
      (acc, filter) => {
         if (industryFilters.includes(filter)) {
            acc[`industrySlug_${filter}`] = filter;
         } else if (geographyFilters.includes(filter)) {
            acc[`geographySlug_${filter}`] = filter;
         }
         return acc;
      },
      {} as Record<string, string>,
   );

   // Fetch data with caching strategy
   let reportsList, industriesData, geographiesData;

   // Try to get data from cache first
   if (reportCache.has(cacheKey)) {
      const cachedEntry = reportCache.get(cacheKey)!;

      // Check if cache is still valid
      if (cachedEntry.expiresAt > now) {
         console.log('Using cached data for reports');
         reportsList = cachedEntry.data;
      } else {
         console.log('Cache expired for reports, fetching fresh data');
         // Cache expired, remove it
         reportCache.delete(cacheKey);
      }
   }

   // If not in cache or cache expired, fetch fresh data
   if (!reportsList) {
      reportsList = await getAllReports({
         page: currentPage,
         limit: ITEMS_PER_PAGE,
         filters: filtersQuery,
         sortBy,
         locale: 'en',
      }).catch((error) => {
         console.error('Error fetching reports:', error);
         return null;
      });

      // Store in cache with expiration
      if (reportsList) {
         reportCache.set(cacheKey, {
            data: reportsList,
            expiresAt: now + CACHE_EXPIRY_TIME * 1000,
         });
      }
   }

   // Fetch and cache industries (check expiration)
   if (!industriesCache || industriesCache.expiresAt <= now) {
      industriesData = await getIndustries().catch((error) => {
         console.error('Error fetching industries:', error);
         return null;
      });

      if (industriesData) {
         industriesCache = {
            data: industriesData,
            expiresAt: now + CACHE_EXPIRY_TIME * 1000,
         };
      } else {
         industriesData = { data: [] };
      }
   } else {
      industriesData = industriesCache.data;
   }

   // Fetch and cache geographies (check expiration)
   if (!geographiesCache || geographiesCache.expiresAt <= now) {
      geographiesData = await getGeographies().catch((error) => {
         console.error('Error fetching geographies:', error);
         return null;
      });

      if (geographiesData) {
         geographiesCache = {
            data: geographiesData,
            expiresAt: now + CACHE_EXPIRY_TIME * 1000,
         };
      } else {
         geographiesData = { data: [] };
      }
   } else {
      geographiesData = geographiesCache.data;
   }

   const totalItems = reportsList?.meta?.pagination?.total || 0;
   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

   return (
      <div className='container pt-40 sm:pt-48'>
         <h1 className='mt-5 text-center font-bold'>Report Store</h1>
         <FilterBar
            industries={industriesData?.data || []}
            geographies={geographiesData?.data || []}
            currentFilters={filters}
            sortBy={sortBy}
            redirectPath='/reports'
         />
         <div className='mb-10 mt-4 flex flex-col items-start justify-between gap-6 lg:min-h-[50vh] lg:flex-row'>
            {/* Main Content */}
            <div className='flex-1'>
               <Suspense
                  fallback={
                     <div className='mb-10 mt-4 flex flex-col items-start justify-between gap-6 lg:min-h-[50vh] lg:flex-row'>
                        <div className='flex-1'>
                           <div className='hidden sm:flex sm:flex-row sm:items-center sm:justify-between'>
                              {/* Static loading state for pagination/view toggle */}
                              <div className='h-10 w-32 animate-pulse rounded bg-gray-200' />
                              <div className='h-10 w-24 animate-pulse rounded bg-gray-200' />
                           </div>
                           <ReportListLoading
                              viewType={viewType as 'list' | 'grid'}
                           />
                        </div>
                     </div>
                  }
               >
                  <div className='mb-2 hidden sm:flex sm:flex-row sm:items-center sm:justify-start'>
                     <Pagination
                        searchParams={searchParams}
                        currentPage={currentPage}
                        totalPages={totalPages}
                     />
                     <span className='ml-auto'>
                        <ViewToggle currentView={viewType} />
                     </span>
                  </div>
                  <div
                     className={`mt-4 grid gap-4 sm:mt-0 ${
                        viewType === 'list'
                           ? 'grid-cols-1'
                           : 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3'
                     }`}
                  >
                     {reportsList?.data && reportsList.data.length > 0 ? (
                        reportsList.data.map((report: Report) => (
                           <ReportStoreItem
                              key={report.attributes.slug}
                              title={report.attributes.title}
                              date={new Date(
                                 report.attributes.oldPublishedAt ||
                                    report.attributes.publishedAt,
                              ).toLocaleDateString('en-US', {
                                 year: 'numeric',
                                 month: 'long',
                                 day: 'numeric',
                              })}
                              slug={report.attributes.slug}
                              description={
                                 report.attributes.shortDescription?.slice(
                                    0,
                                    150,
                                 ) + '...'
                              }
                              viewType={viewType}
                              highlightImageUrl={
                                 report.attributes.highlightImage?.data
                                    ?.attributes
                              }
                              size='small'
                           />
                        ))
                     ) : (
                        <p className='rounded bg-gray-100 p-4 text-2xl font-bold text-gray-600'>
                           No reports found
                        </p>
                     )}
                  </div>
               </Suspense>
            </div>
         </div>
         <Pagination
            searchParams={searchParams}
            currentPage={currentPage}
            totalPages={totalPages}
         />
      </div>
   );
};

// Enable ISR with a revalidation period
export const revalidate = 3600; // Revalidate every hour

export default ReportStore;
