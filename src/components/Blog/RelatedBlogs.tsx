'use client';

import React, { useEffect, useState } from 'react';
import BlogItem from './BlogItem';
import { LocalizedLink } from '../commons/LocalizedLink';
import { getBlogsListingPageClient } from '@/utils/api/csr-services';
import { useLocale } from '@/utils/LocaleContext';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';
import { getFormattedDate } from '@/utils/generic-methods';

interface Industry {
   attributes: {
      slug: string;
      name: string;
   };
}

interface RelatedBlogsProps {
   currentBlogId: number;
   industries: {
      data: Industry[];
   };
}

const ITEMS_PER_PAGE = 10;

const RelatedBlogs: React.FC<RelatedBlogsProps> = ({
   currentBlogId,
   industries,
}) => {
   const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   const { locale } = useLocale();

   useEffect(() => {
      const fetchRelatedBlogs = async () => {
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

            const response = await getBlogsListingPageClient({
               page: 1,
               limit: ITEMS_PER_PAGE,
               filters: industryFilters,
               locale: locale,
            });

            // Filter out the current blog and limit to 6 items
            const filteredBlogs =
               response?.data
                  ?.filter((blog: any) => blog.id !== currentBlogId)
                  ?.slice(0, 6) || [];

            setRelatedBlogs(filteredBlogs);
         } catch (error) {
            console.error('Error fetching related blogs:', error);
         } finally {
            setIsLoading(false);
         }
      };

      if (industries?.data?.length > 0) {
         fetchRelatedBlogs();
      }
   }, [currentBlogId, industries]);

   if (isLoading) {
      return (
         <div className='mt-4'>
            <h2 className='mb-6 text-2xl font-semibold text-gray-900'>
               {TRANSLATED_VALUES[locale]?.blog.relatedBlogs}
            </h2>
            <div className='grid gap-6 md:grid-cols-2'>
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

   if (!relatedBlogs.length) {
      return null;
   }

   return (
      <div className='mt-4 pb-4'>
         <h2 className='mb-6 text-2xl font-semibold text-gray-900'>
            {TRANSLATED_VALUES[locale]?.blog.relatedBlogs}
         </h2>
         <div className='grid gap-6 md:grid-cols-2'>
            {relatedBlogs.map((blog: any) => (
               <LocalizedLink
                  href={`/blogs/${blog.attributes.slug}`}
                  key={blog.id}
               >
                  <BlogItem
                     title={
                        blog.attributes.title?.length > 60
                           ? blog.attributes.title.substring(0, 50) + '...'
                           : blog.attributes.title
                     }
                     thumbnailImage={blog.attributes.thumbnailImage}
                     shortDescription={
                        blog.attributes.shortDescription?.substring(0, 80) +
                        '...'
                     }
                     date={getFormattedDate(blog.attributes, locale)}
                     slug={blog.attributes.slug}
                  />
               </LocalizedLink>
            ))}
         </div>
      </div>
   );
};

export default RelatedBlogs;
