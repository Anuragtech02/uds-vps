const BlogBody = ({ blog }: any) => {
   return (
      <div
         className='report-content blog-content'
         dangerouslySetInnerHTML={{ __html: blog?.description }}
      ></div>
   );
};

export default BlogBody;
