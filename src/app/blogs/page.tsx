import BlogFilters from '@/components/Blog/BlogFilters';
import BlogItem from '@/components/Blog/BlogItem';
import { getBlogsListingPage, getIndustries } from '@/utils/api/services';
import Link from 'next/link';
interface blogsItem {
   id: number;
   title: string;
   shortDescription: string;
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

/**
 * Fetches the blog listing page and industries, maps them to the required types, and returns a JSX component.
 *
 * @returns {JSX.Element} A JSX component with the blog list and industries.
 */
const Blog = async (): Promise<JSX.Element> => {
   let blogListData: Awaited<ReturnType<typeof getBlogsListingPage>>;
   let industriesData: Awaited<ReturnType<typeof getIndustries>>;

   try {
      [blogListData, industriesData] = await Promise.all([
         getBlogsListingPage(),
         getIndustries(),
      ]);
   } catch (error) {
      console.error('Error fetching blogs or industries:', error);
   }

   const blogList = blogListData?.data?.map(
      (
         blog: { attributes: blogsItem; id: number },
         idx: number,
      ): blogsItem => ({
         id: blog?.id ?? idx,
         title: blog?.attributes?.title ?? '',
         shortDescription: blog?.attributes?.shortDescription ?? '',
         description: blog?.attributes?.description ?? '',
         createdAt: blog?.attributes?.createdAt ?? '',
         publishedAt: blog?.attributes?.publishedAt ?? '',
         locale: blog?.attributes?.locale ?? '',
         slug: blog?.attributes?.slug ?? '',
      }),
   );

   const industries = industriesData?.data?.map(
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
   );

   if (!blogList || !industries) {
      console.error(
         'Error fetching blogs or industries: Data is null or undefined',
      );
      return <div>Error fetching data</div>;
   }
   console.log({ shortDescription: blogList[0]?.shortDescription });

   return (
      <div className='container pt-40'>
         <h1 className='mt-5 text-center font-bold'>Blogs</h1>
         <div className='my-10 flex items-start gap-6'>
            <BlogFilters industries={industries} />
            <div className='flex-[0.7] space-y-6'>
               {blogList!.map((blog: blogsItem, i: number) => (
                  <Link href={`/blogs/${blog?.slug}`} key={i}>
                     <BlogItem
                        key={i}
                        title={blog?.title}
                        description={blog?.shortDescription}
                        date={new Intl.DateTimeFormat('en-GB', {
                           day: '2-digit',
                           month: 'long',
                           year: 'numeric',
                        }).format(new Date(blog?.publishedAt))}
                     />
                  </Link>
               ))}
            </div>
         </div>
      </div>
   );
};

export default Blog;
