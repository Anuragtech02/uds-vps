// export const runtime = 'edge';
import BlogItem from '@/components/Blog/BlogItem';
import { LocalizedLink } from '@/components/commons/LocalizedLink';
import ViewToggle from '@/components/Report/ViewToggle';
import FilterBar from '@/components/ReportStore/FilterBar';
import Pagination from '@/components/ReportStore/Pagination';
import {
   getBlogsListingPage,
   getGeographies,
   getIndustries,
} from '@/utils/api/services';
import { LOGO_URL_DARK } from '@/utils/constants';
import { absoluteUrl } from '@/utils/generic-methods';
import { Metadata } from 'next';

interface blogsItem {
   id: number;
   title: string;
   shortDescription: string;
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

   const title = 'Latest Market Research Insights & Analysis Blogs | UnivDatos';
   const description =
      'Stay updated with the latest market research insights, industry trends, and analysis through our comprehensive blogs. Expert perspectives on various sectors and markets.';

   return {
      title,
      description,

      openGraph: {
         title,
         description,
         type: 'website',
         url: locale ? absoluteUrl(`/${locale}/blogs`) : absoluteUrl('/blogs'),
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
                  ? absoluteUrl(`/${locale}/blogs`)
                  : absoluteUrl('/blogs'),
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

/**
 * Fetches the blog listing page and industries, maps them to the required types, and returns a JSX component.
 *
 * @returns {JSX.Element} A JSX component with the blog list and industries.
 */
const Blog = async ({
   searchParams,
}: {
   searchParams: SearchParams;
}): Promise<JSX.Element> => {
   const viewType = searchParams.viewType || 'list';
   const industryFilters =
      searchParams.industries?.split(',').filter(Boolean) || [];
   const geographyFilters =
      searchParams.geographies?.split(',').filter(Boolean) || [];
   const currentPage = parseInt(searchParams.page || '1', 10);
   const sortBy = searchParams.sortBy || 'relevance';

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

   const [blogListData, industriesData, geographiesData] = await Promise.all([
      getBlogsListingPage(
         currentPage,
         ITEMS_PER_PAGE,
         filtersQuery,
         sortBy,
      ).catch((error) => {
         console.error('Error fetching blogs:', error);
         return null;
      }),
      getIndustries().catch((error) => {
         console.error('Error fetching industries:', error);
         return null;
      }),
      getGeographies().catch((error) => {
         console.error('Error fetching geographies:', error);
         return null;
      }),
   ]);

   // console.log(industriesData, blogListData);

   const totalItems = blogListData?.meta?.pagination?.total || 0;
   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

   const blogList =
      blogListData?.data?.map(
         (
            blog: { attributes: blogsItem; id: number },
            idx: number,
         ): blogsItem => ({
            id: blog?.id ?? idx,
            title: blog?.attributes?.title ?? '',
            shortDescription: blog?.attributes?.shortDescription ?? '',
            thumbnailImage:
               // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
               blog?.attributes?.thumbnailImage?.data?.attributes ?? '',
            description: blog?.attributes?.description ?? '',
            createdAt: blog?.attributes?.createdAt ?? '',
            publishedAt: blog?.attributes?.publishedAt ?? '',
            oldPublishedAt: blog?.attributes?.oldPublishedAt ?? '',
            locale: blog?.attributes?.locale ?? '',
            slug: blog?.attributes?.slug ?? '',
         }),
      ) ?? [];

   return (
      <div className='container pt-40'>
         <h1 className='mt-5 text-center font-bold'>Blogs</h1>

         <FilterBar
            industries={industriesData?.data || []}
            geographies={geographiesData?.data || []}
            currentFilters={filters}
            sortBy={sortBy}
            redirectPath='/blogs'
         />

         <div className='mb-10 mt-4 flex flex-col items-start justify-between gap-6 lg:min-h-[50vh]'>
            <div className='w-full flex-1'>
               <div className='flex items-center justify-between'>
                  <Pagination
                     searchParams={searchParams}
                     currentPage={currentPage}
                     totalPages={totalPages}
                  />
                  <ViewToggle currentView={viewType} />
               </div>

               <div
                  className={`grid gap-4 ${
                     viewType === 'list'
                        ? 'grid-cols-1'
                        : 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3'
                  }`}
               >
                  {blogList?.length > 0 ? (
                     blogList.map((blog: blogsItem, i: number) => (
                        <LocalizedLink href={`/blogs/${blog?.slug}`} key={i}>
                           <BlogItem
                              title={blog?.title}
                              thumbnailImage={blog?.thumbnailImage}
                              shortDescription={blog?.shortDescription}
                              date={new Intl.DateTimeFormat('en-IN', {
                                 day: '2-digit',
                                 month: 'short',
                                 year: 'numeric',
                              }).format(
                                 new Date(
                                    blog?.oldPublishedAt || blog?.publishedAt,
                                 ),
                              )}
                              slug={blog?.slug}
                              viewType={viewType}
                           />
                        </LocalizedLink>
                     ))
                  ) : (
                     <p className='rounded bg-gray-100 p-4 text-2xl font-bold text-gray-600'>
                        No Blogs found
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

export default Blog;
