import Link from 'next/link';
import BlogItem from '../Blog/BlogItem';
import { LocalizedLink } from '../commons/LocalizedLink';

const BlogResults = ({ blogs }: { blogs: Array<any> }) => {
   return (
      <div>
         {blogs?.map((blog: any) => (
            <BlogItem
               key={blog.id}
               thumbnailImage={blog?.thumbnailImage}
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
