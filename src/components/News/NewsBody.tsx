const NewsBody = ({ newsArticle }: any) => {
   return (
      <div
         className='report-content news-content'
         dangerouslySetInnerHTML={{ __html: newsArticle?.description }}
      ></div>
   );
};

export default NewsBody;
