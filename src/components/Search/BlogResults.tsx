import BlogItem from '../Blog/BlogItem';
import newsPlaceholder from '@/assets/img/thumbnail_news.jpg';


const BlogResults = ({ blogs }: { blogs: Array<any> }) => {
   return (
      <div className='flex flex-col gap-4'>
         {blogs?.map((blog: any) => (
            <BlogItem
               key={blog.id}
               thumbnailImage={newsPlaceholder.src || blog?.thumbnailImage}
               date={new Date(blog?.oldPublishedAt || blog?.publishedAt).toDateString()}
               title={blog?.title}
               shortDescription={blog?.shortDescription}
               slug={blog?.slug}
            />
         ))}
         {blogs?.length === 0 && <p>No blogs found</p>}
      </div>
   );
};

export default BlogResults;
