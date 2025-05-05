import BlogItem from '../Blog/BlogItem';
import newsPlaceholder from '@/assets/img/thumbnail_news.jpg';
import { LocalizedLink } from '../commons/LocalizedLink';
import { getFormattedDate } from '@/utils/generic-methods';

const BlogResults = ({
   blogs,
   locale = 'en',
}: {
   blogs: Array<any>;
   locale: string;
}) => {
   return (
      <div className='flex flex-col gap-4'>
         {blogs?.map((blog: any) => (
            <LocalizedLink key={blog.id} href={`/blogs/${blog.slug}`}>
               <BlogItem
                  thumbnailImage={{
                     url: newsPlaceholder.src || blog?.thumbnailImage,
                     altContent: blog?.title,
                     width: 100,
                     height: 100,
                  }}
                  date={getFormattedDate(blog, locale)}
                  title={blog?.title}
                  shortDescription={blog?.shortDescription}
                  slug={blog?.slug}
               />
            </LocalizedLink>
         ))}
         {blogs?.length === 0 && <p>No blogs found</p>}
      </div>
   );
};

export default BlogResults;
