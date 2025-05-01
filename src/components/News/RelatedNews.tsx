'use client';

import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import { LocalizedLink } from '../commons/LocalizedLink';
import { getNewsListingPageClient } from '@/utils/api/csr-services';
import { getFormattedDate } from '@/utils/generic-methods';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';

interface Industry {
   attributes: {
      slug: string;
      name: string;
   };
}

interface RelatedNewsProps {
   currentNewsId: number;
   industries: {
      data: Industry[];
   };
   locale?: string;
}

const ITEMS_PER_PAGE = 10;

const RelatedNews: React.FC<RelatedNewsProps> = ({
   currentNewsId,
   industries,
   locale = 'en',
}) => {
   const [relatedNews, setRelatedNews] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchRelatedNews = async () => {
         try {
            setIsLoading(true);

            // Create filter query for all industries
            const industryFilters = industries.data.reduce(
               (acc, industry) => {
                  const slug = industry.attributes.slug;
                  acc[`industriesSlug_${slug}`] = slug;
                  return acc;
               },
               {} as Record<string, string>,
            );

            const response = await getNewsListingPageClient({
               page: 1,
               limit: ITEMS_PER_PAGE,
               filters: industryFilters,
               locale: locale,
            });

            // Filter out the current newsArticle and limit to 6 items
            const filteredNews =
               response?.data
                  ?.filter(
                     (newsArticle: any) => newsArticle.id !== currentNewsId,
                  )
                  ?.slice(0, 6) || [];

            setRelatedNews(filteredNews);
         } catch (error) {
            console.error('Error fetching related news:', error);
         } finally {
            setIsLoading(false);
         }
      };

      if (industries?.data?.length > 0) {
         fetchRelatedNews();
      }
   }, [currentNewsId, industries]);

   if (isLoading) {
      return (
         <div className='mt-4'>
            <h2 className='mb-6 text-2xl font-semibold text-gray-900'>
               {TRANSLATED_VALUES[locale]?.news.relatedNews}
            </h2>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
               {[...Array(4)].map((_, index) => (
                  <div key={index} className='animate-pulse'>
                     <div className='flex w-full flex-col gap-4 rounded-xl bg-white p-6 md:flex-row'>
                        <div className='relative aspect-video rounded-md bg-gray-200 md:w-1/3' />
                        <div className='space-y-4 md:w-2/3'>
                           <div className='h-6 w-3/4 rounded bg-gray-200' />
                           <div className='h-4 w-full rounded bg-gray-200' />
                           <div className='h-4 w-1/4 rounded bg-gray-200' />
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      );
   }

   if (!relatedNews.length) {
      return null;
   }

   return (
      <div className='mt-4 pb-4'>
         <h2 className='mb-6 text-2xl font-semibold text-gray-900'>
            {TRANSLATED_VALUES[locale]?.news.relatedNews}
         </h2>
         <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {relatedNews.map((newsArticle: any) => (
               <NewsItem
                  key={newsArticle.id}
                  title={
                     newsArticle.attributes.title?.length > 60
                        ? newsArticle.attributes.title.substring(0, 50) + '...'
                        : newsArticle.attributes.title
                  }
                  thumbnailImage={newsArticle.attributes.thumbnailImage}
                  date={getFormattedDate(newsArticle.attributes, locale)}
                  slug={newsArticle.attributes.slug}
               />
            ))}
         </div>
      </div>
   );
};

export default RelatedNews;
