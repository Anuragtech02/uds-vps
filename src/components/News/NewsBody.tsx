const NewsBody = ({ newsArticle }: any) => {
   return (
      <div
         className='report-content'
         dangerouslySetInnerHTML={{ __html: newsArticle?.description }}
      ></div>
   );
};

export default NewsBody;
