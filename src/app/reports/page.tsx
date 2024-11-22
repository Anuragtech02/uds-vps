import { FC, Suspense } from 'react';
import ReportStoreItem from '@/components/ReportStore/ReportItem';
import ReportStoreFilters from '@/components/ReportStore/ReportStoreFilters';
import { getAllReports, getIndustries } from '@/utils/api/services';
import Link from 'next/link';
import ReportListLoading from '@/components/ReportStore/ReportListLoading';
import Pagination from '@/components/ReportStore/Pagination';

interface SearchParams {
   filter?: string;
   page?: string;
}

interface Report {
   attributes: {
      slug: string;
      title: string;
      publishedAt: string;
      shortDescription: string;
   };
}

interface ReportStoreProps {
   searchParams: SearchParams;
}

const ITEMS_PER_PAGE = 10;

const ReportStore: FC<ReportStoreProps> = async ({ searchParams }) => {
   const filters = searchParams.filter?.split(',').filter(Boolean) || [];
   const currentPage = parseInt(searchParams.page || '1', 10);

   const filtersQuery = filters.reduce(
      (acc, filter) => {
         acc[`industrySlug_${filter}`] = filter;
         return acc;
      },
      {} as Record<string, string>,
   );

   const [reportsList, industriesData] = await Promise.all([
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
   ]);

   const totalItems = reportsList?.meta?.pagination?.total || 0;
   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

   return (
      <div className='container pt-40'>
         <h1 className='mt-5 text-center font-bold'>Report Store</h1>

         <div className='my-10 flex flex-col items-start justify-between gap-6 lg:min-h-[50vh] lg:flex-row'>
            <div className='w-full lg:sticky lg:top-48 lg:w-[350px]'>
               <Suspense fallback={<div>Loading filters...</div>}>
                  <ReportStoreFilters
                     filters={filters}
                     industries={industriesData?.data || []}
                  />
               </Suspense>
            </div>
            <Suspense fallback={<ReportListLoading />}>
               <div className='items-between grid flex-1 grid-cols-1 gap-4 xl:grid-cols-2'>
                  {reportsList?.data && reportsList.data.length > 0 ? (
                     reportsList.data.map((report: Report) => (
                        <Link
                           key={report.attributes.slug}
                           href={`/reports/${report.attributes.slug}`}
                           className='w-full'
                        >
                           <ReportStoreItem
                              title={report.attributes.title}
                              date={new Date(
                                 report.attributes.publishedAt,
                              ).toLocaleDateString()}
                              description={report.attributes.shortDescription}
                           />
                        </Link>
                     ))
                  ) : (
                     <p className='rounded bg-gray-100 p-4 text-2xl font-bold text-gray-600'>
                        No reports found
                     </p>
                  )}
               </div>
            </Suspense>
         </div>
         {totalPages > 1 && (
            <Pagination
               filters={filters}
               currentPage={currentPage}
               totalPages={totalPages}
            />
         )}
      </div>
   );
};

export default ReportStore;
