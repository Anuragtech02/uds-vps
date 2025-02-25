import { cookies } from 'next/headers';

import API from './config';
import { buildPopulateQuery } from '../generic-methods';
import fetchClient from './config';
import { cache } from 'react';

function getAuthHeaders() {
   if (process.env.API_TOKEN) {
      return {
         Authorization: `Bearer ${process.env.API_TOKEN}`,
      };
   }
   return undefined;
}

const getPaginationQuery = (page: number = 1, limit: number = 10) => {
   return `pagination[page]=${page}&pagination[pageSize]=${limit}`;
};

const getFilterQuery = (
   filters: Record<string, string | number | boolean> = {},
) => {
   return Object.entries(filters)
      .map(([key, value]) => {
         if (key.startsWith('industrySlug')) {
            return `filters[industry][slug][$eq]=${encodeURIComponent(String(value))}`;
         } else if (key.startsWith('industriesSlug')) {
            return `filters[industries][slug][$in]=${encodeURIComponent(String(value))}`;
         } else if (key.startsWith('geographySlug')) {
            return `filters[geography][slug][$eq]=${encodeURIComponent(String(value))}`;
         } else if (key.startsWith('geographiesSlug')) {
            return `filters[geographies][slug][$in]=${encodeURIComponent(String(value))}`;
         }
         return `filters[${key}]=${encodeURIComponent(String(value))}`;
      })
      .join('&');
};

export const getHomePage = async () => {
   try {
      const populateQuery = buildPopulateQuery([
         'heroPrimaryCTA.link',
         'heroSecondaryCTA.link',
         'heroImage.url',
         'animationIndustriesList.name',
         'statisticsCards.icon.url',
         'latestResearchSectionCTABanner.ctaButton.link',
         'brandsSecetionBankLogos.url',
         'testimonialSectionTestimonials.name',
         'upcomingReportsSectionCTABanner.ctaButton.link',
         'mediaSectionLogos.url',
         'seo.metaImage.url',
      ]);
      const response = await fetchClient('/home-page?' + populateQuery, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
   }
};

// export const getReportsPageBySlug = async (slug: string) => {
//    try {
//       const populateQuery = buildPopulateQuery([
//          'industry.name',
//          'geography.name',
//          'heroSectionPrimaryCTA.link',
//          'heroSectionSecondaryCTA.link',
//          'tableOfContent.title',
//          'faqList.title',
//          'ctaBanner.ctaButton.link',
//          'leftSectionPrimaryCTAButton',
//          'leftSectionSecondaryCTAButton',
//          'highlightImage.url',
//          'variants.price.amount',
//       ]);
//       const filterQuery = `?filters[slug][$eq]=${slug}`;
//       const response = await fetchClient(
//          '/reports' + filterQuery + '&' + populateQuery,
//          {
//             headers: getAuthHeaders(),
//          },
//       );
//       return await response;
//    } catch (error) {
//       console.error('Error fetching products:', error);
//       throw error;
//    }
// };

export const getAllReports = cache(
   async (page = 1, limit = 10, filters = {}, sortBy: string = 'relevance') => {
      try {
         let sort = '';
         switch (sortBy) {
            case 'oldPublishedAt:desc':
               sort = 'oldPublishedAt:desc';
               break;
            case 'oldPublishedAt:asc':
               sort = 'oldPublishedAt:asc';
               break;
            default:
               sort = 'relevance';
         }
         const populateQuery = buildPopulateQuery([
            'industry.name',
            'geography.name',
            'highlightImage.url',
         ]);
         const paginationQuery = getPaginationQuery(page, limit);
         const filterQuery = getFilterQuery(filters);
         const sortQuery = sort !== 'relevance' ? `sort[0]=${sort}` : '';
         const query = [populateQuery, paginationQuery, filterQuery, sortQuery]
            .filter(Boolean)
            .join('&');

         const response = await fetchClient('/reports?' + query, {
            headers: getAuthHeaders(),
            next: {
               revalidate: 3600, // Revalidate cached data hourly
               tags: ['reports'], // Tag for manual revalidation
            },
         });
         return await response;
      } catch (error) {
         console.error('Error fetching products:', error);
         throw error;
      }
   },
);

export const getNewsListingPage = async (
   page = 1,
   limit = 10,
   filters = {},
   sortBy: string = 'relevance',
) => {
   try {
      let sort = '';
      switch (sortBy) {
         case 'oldPublishedAt:desc':
            sort = 'oldPublishedAt:desc';
            break;
         case 'oldPublishedAt:asc':
            sort = 'oldPublishedAt:asc';
            break;
         default:
            sort = 'relevance';
      }
      const populateQuery = buildPopulateQuery([
         'industry.name',
         'thumbnailImage.url',
         'author.name',
         'oldPublishedAt',
      ]);
      const paginationQuery = getPaginationQuery(page, limit);
      const filterQuery = getFilterQuery(filters);
      const sortQuery = sort !== 'relevance' ? `sort[0]=${sort}` : '';
      const query = `${populateQuery}&${paginationQuery}&${filterQuery}&${sortQuery}`;
      const response = await fetchClient('/news-articles?' + query, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching News:', error);
      throw error;
   }
};

export const getBlogsListingPage = async (
   page = 1,
   limit = 10,
   filters = {},
   sortBy: string = 'relevance',
) => {
   try {
      let sort = '';
      switch (sortBy) {
         case 'oldPublishedAt:desc':
            sort = 'oldPublishedAt:desc';
            break;
         case 'oldPublishedAt:asc':
            sort = 'oldPublishedAt:asc';
            break;
         default:
            sort = 'relevance';
      }
      const populateQuery = buildPopulateQuery([
         'industry.name',
         'thumbnailImage.url',
         'author.name',
         'oldPublishedAt',
      ]);
      const paginationQuery = getPaginationQuery(page, limit);
      const filterQuery = getFilterQuery(filters);
      const sortQuery = sort !== 'relevance' ? `sort[0]=${sort}` : '';
      const query = `${populateQuery}&${paginationQuery}&${filterQuery}&${sortQuery}`;
      const response = await fetchClient('/blogs?' + query, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching Blogs:', error);
      throw error;
   }
};

export const getIndustries = cache(async (page = 1, limit = 100) => {
   try {
      const paginationQuery = getPaginationQuery(page, limit);
      const response = await fetchClient('/industries?' + paginationQuery, {
         headers: getAuthHeaders(),
         next: {
            revalidate: 86400, // Revalidate daily (industries change less frequently)
            tags: ['industries'],
         },
      });
      return await response;
   } catch (error) {
      console.error('Error fetching Industries:', error);
      throw error;
   }
});

export const getGeographies = cache(async (page = 1, limit = 100) => {
   try {
      const paginationQuery = getPaginationQuery(page, limit);
      const response = await fetchClient('/geographies?' + paginationQuery, {
         headers: getAuthHeaders(),
         next: {
            revalidate: 86400, // Revalidate daily
            tags: ['geographies'],
         },
      });
      return await response;
   } catch (error) {
      console.error('Error fetching Geographies:', error);
      throw error;
   }
});

export const getAboutPage = async () => {
   try {
      const populateQuery = buildPopulateQuery([
         'heroPrimaryCTAButton',
         'heroSecondaryCTAButton',
         'statisticsCards',
         'researchSectionImage',
         'visionMissionCards',
         'visionMissionCards.image',
         'mediaSecrtionLogos',
         'ctaBanner',
         'ctaBanner.ctaButton',
         'mediaSecrtionLogos',
      ]);
      const response = await fetchClient('/about-page?' + populateQuery, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching News:', error);
      throw error;
   }
};

export const getHeader = async () => {
   try {
      const populateQuery = buildPopulateQuery(['logo', 'ctaButton']);
      const response = await fetchClient('/header?' + populateQuery, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching News:', error);
      throw error;
   }
};

export const getFooter = async () => {
   try {
      const populateQuery = buildPopulateQuery([
         'footerCTA',
         'footerCTA.ctaButton',
         'companyInfo',
         'companyInfo.logo',
         'industries.slug',
      ]);
      const response = await fetchClient('/footer?' + populateQuery, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching News:', error);
      throw error;
   }
};

export const getHeaderMainMenu = async () => {
   try {
      const response = await fetchClient('/menus/1?nested&populate=*', {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching main menu:', error);
      throw error;
   }
};
export const getFooterQuickLinks = async () => {
   try {
      const response = await fetchClient('/menus/2?nested&populate=*', {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching main menu:', error);
      throw error;
   }
};

export const getContagePageData = async () => {
   try {
      const populateQuery = buildPopulateQuery([
         'contactDetailsList',
         'contactDetailsList.icon',
         'socialMediaSectionIconsList',
         'socialMediaSectionIconsList.icon',
         'contactFormFields',
      ]);
      const response = await fetchClient('/contact-page?' + populateQuery, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching main menu:', error);
      throw error;
   }
};

export const getBlogDetails = async (slug: string) => {
   try {
      const populateQuery = buildPopulateQuery([
         'thumbnailImage',
         'industries',
         'author',
         'author.profilePicture',
      ]);
      const response = await fetchClient(
         `/blogs?filters[slug][$eq]=${slug}&` + populateQuery,
         {
            headers: getAuthHeaders(),
         },
      );
      return await response;
   } catch (error) {
      console.error('Error fetching main menu:', error);
      throw error;
   }
};

export const getNewsBySlug = async (slug: string) => {
   try {
      const populateQuery = buildPopulateQuery([
         'thumbnailImage',
         'industries',
         'author',
         'author.profilePicture',
      ]);
      const response = await fetchClient(
         `/news-articles?filters[slug][$eq]=${slug}&` + populateQuery,
         {
            headers: getAuthHeaders(),
         },
      );
      console.log(response);
      return response;
   } catch (error) {
      console.error('Error fetching news article by slug:', error);
      throw error;
   }
};

export const getServicesPage = async () => {
   try {
      const populateQuery = buildPopulateQuery([
         'mediaSecrtionLogos',
         'ctaBanner',
         'ctaBanner.ctaButton',
         'mediaSecrtionLogos',
      ]);
      const response = await fetchClient('/services-page?' + populateQuery, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching service page:', error);
      throw error;
   }
};

export const getAllServices = async (page = 1, limit = 10, filters = {}) => {
   try {
      const populateQuery = buildPopulateQuery(['highlightImage.url']);
      const paginationQuery = getPaginationQuery(page, limit);
      const filterQuery = getFilterQuery(filters);
      const query = `${populateQuery}&${paginationQuery}&${filterQuery}`;
      const response = await fetchClient('/services?' + query, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching all services:', error);
      throw error;
   }
};
export const getServiceBySlug = async (slug: string) => {
   try {
      const populateQuery = buildPopulateQuery(['highlightImage.url']);
      const response = await fetchClient(
         `/services?filters[slug][$eq]=${slug}&` + populateQuery,
         {
            headers: getAuthHeaders(),
         },
      );
      return await response;
   } catch (error) {
      console.error('Error fetching main menu:', error);
      throw error;
   }
};

export const getPrivacyPolicy = async () => {
   try {
      const response = await fetchClient('/privacy-policy', {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching privacy policy:', error);
      throw error;
   }
};

export const getTermsAndConditions = async () => {
   try {
      const response = await fetchClient('/t-and-c', {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching terms and conditions:', error);
      throw error;
   }
};

export const getLegal = async () => {
   try {
      const response = await fetchClient('/legal', {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching legal:', error);
      throw error;
   }
};

export const getDisclaimer = async () => {
   try {
      const response = await fetchClient('/disclaimer', {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching disclaimer:', error);
      throw error;
   }
};

export const getRootConfig = async () => {
   try {
      const response = await fetchClient('/root-config', {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching root config:', error);
      throw error;
   }
};

/**
 * Fetches the most viewed or recently published reports to pre-render
 * @param {number} limit - Number of reports to fetch
 * @returns {Promise<Object>} - Object containing the report data
 */
export const getMostViewedReports = cache(async (limit = 50) => {
   try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
      const API_TOKEN = process.env.API_TOKEN || '';

      // First try to get reports with view counts
      // This assumes you have a viewCount field or similar
      const queryParams = new URLSearchParams({
         'pagination[limit]': limit.toString(),
         sort: 'viewCount:desc,oldPublishedAt:desc', // Sort by views and then by date
         'fields[0]': 'slug', // Only request the slug field to minimize payload
      });

      const response = await fetch(
         `${API_URL}/reports?${queryParams.toString()}`,
         {
            headers: {
               Authorization: `Bearer ${API_TOKEN}`,
            },
            next: {
               revalidate: 86400, // Revalidate daily
               tags: ['popular-reports'],
            },
         },
      );

      if (!response.ok) {
         throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // If we don't get enough reports, fall back to recently published
      if (data.data.length < limit) {
         const fallbackParams = new URLSearchParams({
            'pagination[limit]': (limit - data.data.length).toString(),
            sort: 'oldPublishedAt:desc', // Sort by publication date
            'fields[0]': 'slug', // Only request the slug field
         });

         const fallbackResponse = await fetch(
            `${API_URL}/reports?${fallbackParams.toString()}`,
            {
               headers: {
                  Authorization: `Bearer ${API_TOKEN}`,
               },
               next: {
                  revalidate: 86400, // Revalidate daily
               },
            },
         );

         if (!fallbackResponse.ok) {
            return data; // Return what we have if fallback fails
         }

         const fallbackData = await fallbackResponse.json();

         // Combine the two sets, avoiding duplicates
         const existingSlugs = new Set(
            data.data.map((report: any) => report.attributes.slug),
         );
         const uniqueFallbackData = fallbackData.data.filter(
            (report: any) => !existingSlugs.has(report.attributes.slug),
         );

         // Merge the datasets
         data.data = [...data.data, ...uniqueFallbackData];
      }

      return data;
   } catch (error) {
      console.error('Error fetching popular reports:', error);

      // If the popular reports endpoint fails, fall back to getting the latest reports
      try {
         const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
         const API_TOKEN = process.env.API_TOKEN || '';

         const queryParams = new URLSearchParams({
            'pagination[limit]': limit.toString(),
            sort: 'oldPublishedAt:desc',
            'fields[0]': 'slug',
         });

         const response = await fetch(
            `${API_URL}/reports?${queryParams.toString()}`,
            {
               headers: {
                  Authorization: `Bearer ${API_TOKEN}`,
               },
               next: {
                  revalidate: 86400,
               },
            },
         );

         if (!response.ok) {
            throw new Error(`API error in fallback: ${response.status}`);
         }

         return await response.json();
      } catch (fallbackError) {
         console.error('Fallback error fetching reports:', fallbackError);
         return { data: [] }; // Return empty data if all attempts fail
      }
   }
});

/**
 * Fetches a report by its slug with proper caching
 * @param {string} slug - The report slug
 * @returns {Promise<Object>} - Object containing the report data
 */
export const getReportsPageBySlug = cache(async (slug: string) => {
   try {
      const populateQuery = buildPopulateQuery([
         'industry.name',
         'geography.name',
         'heroSectionPrimaryCTA.link',
         'heroSectionSecondaryCTA.link',
         'tableOfContent.title',
         'faqList.title',
         'ctaBanner.ctaButton.link',
         'leftSectionPrimaryCTAButton',
         'leftSectionSecondaryCTAButton',
         'highlightImage.url',
         'variants.price.amount',
      ]);
      const filterQuery = `?filters[slug][$eq]=${slug}`;

      const response = await fetchClient(
         '/reports' + filterQuery + '&' + populateQuery,
         {
            headers: getAuthHeaders(),
            next: {
               revalidate: 86400, // Cache for 24 hours
               tags: [`report-${slug}`], // Tag with the specific report for targeted revalidation
            },
         },
      );

      return await response;
   } catch (error) {
      console.error(`Error fetching report with slug ${slug}:`, error);
      throw error;
   }
});
