const BlogBody = ({ blog }: any) => {
   return (
      <div
         className='report-content'
         dangerouslySetInnerHTML={{ __html: blog?.description }}
      ></div>
   );
};

export default BlogBody;
