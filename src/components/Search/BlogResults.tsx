import Link from 'next/link';
import BlogItem from '../Blog/BlogItem';

const BlogResults = ({ blogs }) => {
   return (
      <div>
         {blogs?.map((blog) => (
            <Link href={`/blogs/${blog?.slug}`} key={blog?.id}>
               <BlogItem
                  key={blog.id}
                  thumbnailImage={blog?.thumbnailImage}
                  date={new Date(blog?.publishedAt).toDateString()}
                  title={blog?.title}
                  shortDescription={blog?.shortDescription}
               />
            </Link>
         ))}
         {blogs?.length === 0 && <p>No blogs found</p>}
      </div>
   );
};

export default BlogResults;
