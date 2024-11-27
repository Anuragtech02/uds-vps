import BlogFilters from '@/components/Blog/BlogFilters';
import BlogItem from '@/components/Blog/BlogItem';
import Pagination from '@/components/ReportStore/Pagination';
import { getBlogsListingPage, getIndustries } from '@/utils/api/services';
import Link from 'next/link';
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
   lang,
}: {
   searchParams: {
      filter?: string;
      page?: string;
   };
}): Promise<JSX.Element> => {
   console.log({ lang });
   const filters = searchParams.filter?.split(',').filter(Boolean) || [];
   const currentPage = parseInt(searchParams.page || '1', 10);
   const filtersQuery = filters.reduce(
      (acc, filter) => {
         acc[`industriesSlug_${filter}`] = filter;
         return acc;
      },
      {} as Record<string, string>,
   );
   let blogListData: Awaited<ReturnType<typeof getBlogsListingPage>>;
   let industriesData: Awaited<ReturnType<typeof getIndustries>>;

   try {
      [blogListData, industriesData] = await Promise.all([
         getBlogsListingPage(currentPage, ITEMS_PER_PAGE, filtersQuery),
         getIndustries(),
      ]);
   } catch (error) {
      console.error('Error fetching blogs or industries:', error);
   }
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
            locale: blog?.attributes?.locale ?? '',
            slug: blog?.attributes?.slug ?? '',
         }),
      ) ?? [];

   const industries =
      industriesData?.data?.map(
         (
            industry: { attributes: industryItem; id: number },
            idx: number,
         ): industryItem => ({
            id: industry?.id ?? idx,
            name: industry?.attributes?.name ?? '',
            createdAt: industry?.attributes?.createdAt ?? '',
            publishedAt: industry?.attributes?.publishedAt ?? '',
            slug: industry?.attributes?.slug ?? '',
         }),
      ) ?? [];

   return (
      <div className='container pt-40'>
         <h1 className='mt-5 text-center font-bold'>Blogs</h1>

         <div className='my-10 flex flex-col items-start justify-between gap-6 lg:min-h-[50vh] lg:flex-row'>
            <div className='w-full lg:sticky lg:top-48 lg:w-[350px]'>
               <BlogFilters industries={industries} filters={filters} />
            </div>

            <div className='flex grow flex-col gap-4 md:gap-6'>
               {blogList?.length > 0 ? (
                  blogList!.map((blog: blogsItem, i: number) => (
                     <Link href={`/blogs/${blog?.slug}`} key={i}>
                        <BlogItem
                           key={i}
                           title={blog?.title}
                           thumbnailImage={blog?.thumbnailImage}
                           shortDescription={blog?.shortDescription}
                           date={new Intl.DateTimeFormat('en-GB', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                           }).format(new Date(blog?.publishedAt))}
                        />
                     </Link>
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
               filters={filters}
               currentPage={currentPage}
               totalPages={totalPages}
            />
         )}
      </div>
   );
};

export default Blog;
