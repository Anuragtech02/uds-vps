export const runtime = 'edge';

import { FC, Suspense, useState } from 'react';
import ReportStoreItem from '@/components/ReportStore/ReportItem';
import ReportStoreFilters from '@/components/ReportStore/ReportStoreFilters';
import { getAllReports, getIndustries } from '@/utils/api/services';
import Link from 'next/link';
import ReportListLoading from '@/components/ReportStore/ReportListLoading';
import Pagination from '@/components/ReportStore/Pagination';
import ViewToggle from '@/components/Report/ViewToggle';
import SelectedFilters from '@/components/Report/SelectedFitlers';

interface SearchParams {
   // filter?: string;
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
      }
   };
}

interface ReportStoreProps {
   searchParams: SearchParams;
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

  console.log(filtersQuery)

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
      <div className="container pt-40">
      <h1 className="mt-5 text-center font-bold">Report Store</h1>

      <div className="my-10 flex flex-col items-start justify-between gap-6 lg:min-h-[50vh] lg:flex-row">
        <div className="w-full lg:sticky lg:top-48 lg:w-[350px]">
          <Suspense fallback={<div>Loading filters...</div>}>
            <ReportStoreFilters
              filters={filters}
              industries={industriesData?.data || []}
            />
          </Suspense>
        </div>
        <div className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            {/* <h4>All Reports</h4> */}
            <SelectedFilters industries={filters} industriesData={industriesData} />
            <ViewToggle currentView={viewType} />
          </div>
          <Suspense fallback={<ReportListLoading />}>
            <div
              className={`grid gap-4 ${
                viewType === 'list'
                  ? 'grid-cols-1'
                  : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-2'
              }`}
            >
              {reportsList?.data && reportsList.data.length > 0 ? (
                reportsList.data.map((report: Report) => (
                  <ReportStoreItem
                    key={report.attributes.slug}
                    title={report.attributes.title}
                    date={new Date(
                      report.attributes.oldPublishedAt || report.attributes.publishedAt,
                    ).toLocaleDateString()}
                    slug={report.attributes.slug}
                    description={report.attributes.shortDescription}
                    viewType={viewType}
                    highlightImageUrl={report.attributes.highlightImage?.data?.attributes?.url}
                  />
                ))
              ) : (
                <p className="rounded bg-gray-100 p-4 text-2xl font-bold text-gray-600">
                  No reports found
                </p>
              )}
            </div>
          </Suspense>
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

export default ReportStore;
