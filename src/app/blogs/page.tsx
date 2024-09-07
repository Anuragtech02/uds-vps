import BlogFilters from '@/components/Blog/BlogFilters';
import BlogItem from '@/components/Blog/BlogItem';
import { getBlogsListingPage, getIndustries } from '@/utils/api/services';
interface blogsItem {
   title: string;
   shortDescrption: string;
   description: string;
   createdAt: string;
   publishedAt: string;
   locale: string;
}

interface industryItem {
   id: number;
   name: string;
   createdAt: string;
   publishedAt: string;
   slug: string;
}

const Blog = async () => {
   const blogListData = await getBlogsListingPage();
   const blogList = blogListData?.data?.map(
      (
         blog: {
            attributes: blogsItem;
            id: number;
         },
         idx: number,
      ) => {
         return {
            id: blog?.id ?? idx,
            title: blog?.attributes?.title ?? '',
            shortDescrption: blog?.attributes?.shortDescrption ?? '',
            description: blog?.attributes?.description ?? '',
            createdAt: blog?.attributes?.createdAt ?? '',
            publishedAt: blog?.attributes?.publishedAt ?? '',
            locale: blog?.attributes?.locale ?? '',
         };
      },
   );
   const industriesData = await getIndustries();
   const industries = industriesData?.data?.map(
      (
         industry: {
            attributes: industryItem;
            id: number;
         },
         idx: number,
      ) => {
         return {
            id: industry?.id ?? idx,
            name: industry?.attributes?.name ?? '',
            createdAt: industry?.attributes?.createdAt ?? '',
            publishedAt: industry?.attributes?.publishedAt ?? '',
            slug: industry?.attributes?.slug ?? '',
         };
      },
   );
   return (
      <div className='container pt-40'>
         <h1 className='mt-5 text-center font-bold'>Blogs</h1>
         <div className='my-10 flex items-start gap-6'>
            <BlogFilters industries={industries} />
            <div className='flex-[0.7] space-y-6'>
               {blogList?.map((blog: blogsItem, i: number) => (
                  <BlogItem
                     key={i}
                     title={blog?.title}
                     description={blog?.description}
                     date={new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                     }).format(new Date(blog?.publishedAt))}
                  />
               ))}
            </div>
         </div>
      </div>
   );
};

export default Blog;
