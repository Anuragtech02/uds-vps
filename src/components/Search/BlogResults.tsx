import Link from 'next/link';
import BlogItem from '../Blog/BlogItem';

const BlogResults = ({ blogs }) => {
   return (
      <div>
         {blogs?.map((blog) => (
            <Link href={`/blogs/${blog?.slug}`} key={blog?.id}>
               <BlogItem
                  key={blog.id}
                  date={new Date(blog?.publishedAt).toDateString()}
                  title={blog?.title}
                  description={blog?.shortDescription}
               />
            </Link>
         ))}
      </div>
   );
};

export default BlogResults;
