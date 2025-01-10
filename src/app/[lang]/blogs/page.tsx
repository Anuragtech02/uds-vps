export const runtime = 'edge';
import BlogFilters from '@/components/Blog/BlogFilters';
import BlogItem from '@/components/Blog/BlogItem';
import { LocalizedLink } from '@/components/commons/LocalizedLink';
import Pagination from '@/components/ReportStore/Pagination';
import { getBlogsListingPage, getIndustries } from '@/utils/api/services';

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

interface industryItem {
   id: number;
   name: string;
   createdAt: string;
   publishedAt: string;
   slug: string;
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
   searchParams: any
}): Promise<JSX.Element> => {
   const industryFilters =
   searchParams.industries?.split(',').filter(Boolean) || [];
   const geographyFilters =
      searchParams.geographies?.split(',').filter(Boolean) || [];
   const currentPage = parseInt((searchParams.page || '1'), 10);

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

   const [blogListData, industriesData] = await Promise.all([
      getBlogsListingPage(currentPage, ITEMS_PER_PAGE, filtersQuery)
      .catch((error) => {
         console.error('Error fetching blogs:', error);
         return null;
      }),
      getIndustries().catch((error) => {
         console.error('Error fetching industries:', error);
         return null;
      }) ]);

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

         <div className='my-10 flex flex-col items-start justify-between gap-6 lg:min-h-[50vh] lg:flex-row'>
            <div className='w-full lg:sticky lg:top-48 lg:w-[350px]'>
               <BlogFilters industries={industriesData?.data} filters={filters} />
            </div>

            <div className='flex grow flex-col gap-4 md:gap-6'>
               {blogList?.length > 0 ? (
                  blogList!.map((blog: blogsItem, i: number) => (
                     <LocalizedLink href={`/blogs/${blog?.slug}`} key={i}>
                        <BlogItem
                           key={i}
                           title={blog?.title}
                           thumbnailImage={blog?.thumbnailImage}
                           shortDescription={blog?.shortDescription}
                           date={new Intl.DateTimeFormat('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                           }).format(new Date(blog?.oldPublishedAt || blog?.publishedAt))}
                           slug={blog?.slug}
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
