export const runtime = 'edge';

import { FC, Suspense } from 'react';
import ReportStoreItem from '@/components/ReportStore/ReportItem';
import ReportStoreFilters from '@/components/ReportStore/ReportStoreFilters';
import GeographyFilters from '@/components/ReportStore/GeographFilters';
import {
   getAllReports,
   getIndustries,
   getGeographies,
} from '@/utils/api/services';
import ReportListLoading from '@/components/ReportStore/ReportListLoading';
import Pagination from '@/components/ReportStore/Pagination';
import ViewToggle from '@/components/Report/ViewToggle';
import SelectedFilters from '@/components/Report/SelectedFitlers';
import { absoluteUrl } from '@/utils/generic-methods';
import { Metadata } from 'next';
import { LOGO_URL_DARK } from '@/utils/constants';
import FilterBar from '@/components/ReportStore/FilterBar';

interface SearchParams {
   industries?: string;
   geographies?: string;
   page?: string;
   viewType?: string;
}

interface Report {
   attributes: {
      slug: string;
      title: string;
      publishedAt: string;
      shortDescription: string;
      oldPublishedAt: string;
      highlightImage: {
         data: {
            attributes: {
               url: string;
            };
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

const ITEMS_PER_PAGE = 10;

const ReportStore: FC<ReportStoreProps> = async ({ searchParams }) => {
   const viewType = searchParams.viewType || 'list';
   const industryFilters =
      searchParams.industries?.split(',').filter(Boolean) || [];
   const geographyFilters =
      searchParams.geographies?.split(',').filter(Boolean) || [];
   const currentPage = parseInt(searchParams.page || '1', 10);

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

   const [reportsList, industriesData, geographiesData] = await Promise.all([
      getAllReports(currentPage, ITEMS_PER_PAGE, filtersQuery).catch(
         (error) => {
            console.error('Error fetching reports:', error);
            return null;
         },
      ),
      getIndustries().catch((error) => {
         console.error('Error fetching industries:', error);
         return null;
      }),
      getGeographies().catch((error) => {
         console.error('Error fetching geographies:', error);
         return null;
      }),
   ]);

   const totalItems = reportsList?.meta?.pagination?.total || 0;
   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

   return (
      <div className='container pt-40'>
         <h1 className='mt-5 text-center font-bold'>Report Store</h1>

         <FilterBar
            industries={industriesData?.data || []}
            geographies={geographiesData?.data || []}
            currentFilters={filters}
         />

         <div className='my-10 flex flex-col items-start justify-between gap-6 lg:min-h-[50vh] lg:flex-row'>
            {/* Main Content */}
            <div className='flex-1'>
               <div className='flex items-center justify-between'>
                  <Pagination
                     searchParams={searchParams}
                     currentPage={currentPage}
                     totalPages={totalPages}
                  />
                  <ViewToggle currentView={viewType} />
               </div>
               <Suspense fallback={<ReportListLoading />}>
                  <div
                     className={`grid gap-4 ${
                        viewType === 'list'
                           ? 'grid-cols-1'
                           : 'grid-cols-1 lg:grid-cols-2'
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
                                    ?.attributes?.url
                              }
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

export default ReportStore;
