'use client';

import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import { LocalizedLink } from '../commons/LocalizedLink';
import { getNewsListingPageClient } from '@/utils/api/csr-services';

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
}

const ITEMS_PER_PAGE = 6;

const RelatedNews: React.FC<RelatedNewsProps> = ({ 
  currentNewsId,
  industries
}) => {
  const [relatedNews, setRelatedNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedNews = async () => {
      try {
        setIsLoading(true);
        
        // Create filter query for all industries
        const industryFilters = industries.data.reduce((acc, industry) => {
          const slug = industry.attributes.slug;
          acc[`industriesSlug_${slug}`] = slug;
          return acc;
        }, {} as Record<string, string>);

        const response = await getNewsListingPageClient(1, ITEMS_PER_PAGE, industryFilters);
        
        // Filter out the current newsArticle and limit to 6 items
        const filteredNews = response?.data
          ?.filter((newsArticle: any) => newsArticle.id !== currentNewsId)
          ?.slice(0, 6) || [];
          
        setRelatedNews(filteredNews);
      } catch (error) {
        console.error('Error fetching related blogs:', error);
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
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">Related Articles</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex w-full flex-col gap-4 rounded-xl bg-white p-6 md:flex-row">
                <div className="relative aspect-video rounded-md bg-gray-200 md:w-1/3" />
                <div className="md:w-2/3 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
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
    <div className="mt-12">
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">Related Articles</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {relatedNews.map((newsArticle: any) => (
            <NewsItem
            key={newsArticle.id}
              title={newsArticle.attributes.title?.length > 60 ? newsArticle.attributes.title.substring(0, 50) + '...' : newsArticle.attributes.title}
              thumbnailImage={newsArticle.attributes.thumbnailImage}
              
              date={new Intl.DateTimeFormat('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }).format(new Date(newsArticle.attributes.oldPublishedAt || newsArticle.attributes.publishedAt))}
              slug={newsArticle.attributes.slug}
            />
        ))}
      </div>
    </div>
  );
};

export default RelatedNews;