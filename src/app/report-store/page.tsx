import ReportsPagination from '@/components/ReportStore/Pagination';
import ReportStoreItem from '@/components/ReportStore/ReportItem';
import ReportStoreFilters from '@/components/ReportStore/ReportStoreFilters';
import { getAllReports, getIndustries } from '@/utils/api/services';
import Link from 'next/link';

const ReportStore = async ({ searchParams }) => {
   const filters = searchParams?.filter?.split(',');
   const currentPage = searchParams?.page || 1;
   const ITEMS_PER_PAGE = 1;
   let reportsList: Awaited<ReturnType<typeof getAllReports>>;
   let industriesData: Awaited<ReturnType<typeof getIndustries>>;

   try {
      let filtersQuery = {};
      if (filters) {
         for (let i = 0; i < filters?.length; i++) {
            filtersQuery['industrySlug_' + filters[i]] = filters[i];
         }
      }
      console.log(filtersQuery);
      [reportsList, industriesData] = await Promise.all([
         getAllReports(currentPage, ITEMS_PER_PAGE, filtersQuery),
         getIndustries(),
      ]);
      console.log('here', JSON.stringify(reportsList));
   } catch (error) {
      console.error('Error fetching blogs or industries:', error);
   }
   const totalItems = reportsList?.meta?.pagination?.total;
   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

   return (
      <div className='container pt-40'>
         <h1 className='mt-5 text-center'>Report Store</h1>
         <div className='my-10 flex min-h-[50vh] items-start gap-6'>
            <ReportStoreFilters
               filters={filters}
               industries={industriesData?.data}
            />
            <div className='flex-[0.7] space-y-6'>
               {reportsList?.data?.length > 0 ? (
                  reportsList?.data?.map((report: any, i: number) => (
                     <Link
                        key={i}
                        href={`/report-store/${report?.attributes?.slug}`}
                     >
                        <ReportStoreItem
                           key={i}
                           title={report?.attributes?.title}
                           date={new Date(
                              report?.attributes?.publishedAt,
                           ).toDateString()}
                           description={report?.attributes?.shortDescription}
                        />
                     </Link>
                  ))
               ) : (
                  <p className='text-white-600 rounded p-4 text-2xl font-bold'>
                     No reports found
                  </p>
               )}
            </div>
         </div>
         {totalPages > 1 && (
            <ReportsPagination
               filters={filters}
               currentPage={currentPage}
               totalPages={totalPages}
            />
         )}
      </div>
   );
};

export default ReportStore;
