'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CalendarSvg, CommentSvg, TagIcon } from '../commons/Icons';
import { LocalizedLink } from '../commons/LocalizedLink';

const Header: React.FC<{ newsArticle: any }> = ({ newsArticle }) => {
   const headerRef1 = useRef<HTMLDivElement>(null);
   const headerRef2 = useRef<HTMLDivElement>(null);
   const [showSecondHeader, setShowSecondHeader] = useState(false);

   useEffect(() => {
      const handleScroll = () => {
         const scrollPosition = window.scrollY;
         const header1Height = headerRef1.current?.clientHeight || 0;
         setShowSecondHeader(scrollPosition > header1Height + 110);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   useEffect(() => {
      if (showSecondHeader && headerRef2.current) {
         gsap.fromTo(
            headerRef2.current,
            { y: -50, opacity: 0, delay: 0.3 },
            { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' },
         );
      }
   }, [showSecondHeader]);

   const author = newsArticle?.author?.data?.attributes;
   const publishedAt = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
   }).format(new Date(newsArticle?.oldPublishedAt || newsArticle?.publishedAt));

   const industries = newsArticle?.industries?.data?.map((industry: any) => {
      return {
         id: industry?.id,
         ...industry?.attributes,
      };
   });

   // function getIndustryLinkWithParams(industry: any) {
   //    const currentParams = new URLSearchParams(window.location.search);

   //    const updatedParams = Object.fromEntries(currentParams);
   //    const existingIndustries = updatedParams.industries ? updatedParams.industries + ',' : '';
   //    updatedParams.industries = existingIndustries + industry.slug;

   //    return `?${new URLSearchParams(updatedParams).toString()}`;
   // }

   return (
      <>
         <div
            className={`mt-[140px] w-full bg-white py-4 transition-all duration-300 sm:mt-[160px] sm:pt-[50px]`}
            ref={headerRef1}
         >
            <div className='container'>
               <div className='flex gap-8'>
                  <div className='mx-auto w-full space-y-4 font-semibold md:space-y-6 xl:w-2/3'>
                     <h1 className='h3 mx-auto text-center font-bold'>
                        {newsArticle?.title}
                     </h1>
                     <div className='mx-auto flex flex-wrap justify-center gap-3'>
                        {industries?.map((industry: any, index: number) => (
                           <LocalizedLink
                              key={index}
                              href={`/news?industries=${industry?.slug}`}
                           >
                              <div className='flex items-center gap-2 rounded-full border border-s-300 bg-s-100 px-4 py-1 text-blue-4'>
                                 <TagIcon /> {industry?.name}
                              </div>
                           </LocalizedLink>
                        ))}
                     </div>
                     <div className='flex justify-between border-y border-s-300 py-4'>
                        {author?.name && (
                           <div className='flex items-center gap-4'>
                              {/* <img
                                 src={
                                    author?.profilePicture?.data?.attributes
                                       ?.url
                                 }
                                 alt=''
                                 className='h-12 w-12 rounded-full'
                              /> */}
                              <p className='text-s-600'>
                                 Author: {author?.name}
                              </p>
                           </div>
                        )}

                        <div className='ml-auto flex items-center gap-4'>
                           <div className='flex items-center gap-2 text-s-600'>
                              <CalendarSvg /> <p>{publishedAt}</p>
                           </div>
                           {/* <div className='flex items-center gap-2 text-s-600'>
                              <CommentSvg /> <p>0 comments</p>
                           </div> */}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         {/* {showSecondHeader && (
            <div
               className={`sticky left-0 right-0 top-0 z-20 border-b border-s-300 bg-white py-4 transition-all duration-300`}
               ref={headerRef2}
            >
               <div className='container'>
                  <div className='flex items-start justify-between gap-6'>
                     <h1 className='h3 font-bold xl:w-2/3'>
                        {newsArticle?.title}
                     </h1>
                     <div className='flex items-center justify-end gap-2 py-4'></div>
                  </div>
               </div>
            </div>
         )} */}
      </>
   );
};

export default Header;
