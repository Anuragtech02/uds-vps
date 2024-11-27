import Link from 'next/link';
import BlogItem from '../Blog/BlogItem';

const BlogResults = ({ blogs }: { blogs: Array<any> }) => {
   return (
      <div>
         {blogs?.map((blog: any) => (
            <LocalizedLink href={`/blogs/${blog?.slug}`} key={blog?.id}>
               <BlogItem
                  key={blog.id}
                  thumbnailImage={blog?.thumbnailImage}
                  date={new Date(blog?.publishedAt).toDateString()}
                  title={blog?.title}
                  shortDescription={blog?.shortDescription}
               />
            </LocalizedLink>
         ))}
         {blogs?.length === 0 && <p>No blogs found</p>}
      </div>
   );
};

export default BlogResults;
