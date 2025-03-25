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
         'seo.metaImage.url',
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
         'seo.metaImage.url',
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
         'seo.metaImage.url',
      ]);
      const response = await fetchClient(
         `/news-articles?filters[slug][$eq]=${slug}&` + populateQuery,
         {
            headers: getAuthHeaders(),
         },
      );
      // console.log(response);
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
   const populateQuery = buildPopulateQuery(['seo.metaImage.url']);
   try {
      const response = await fetchClient('/privacy-policy?' + populateQuery, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching privacy policy:', error);
      throw error;
   }
};

export const getTermsAndConditions = async () => {
   const populateQuery = buildPopulateQuery(['seo.metaImage.url']);
   try {
      const response = await fetchClient('/t-and-c?' + populateQuery, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching terms and conditions:', error);
      throw error;
   }
};

export const getLegal = async () => {
   const populateQuery = buildPopulateQuery(['seo.metaImage.url']);
   try {
      const response = await fetchClient('/legal?' + populateQuery, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching legal:', error);
      throw error;
   }
};

export const getDisclaimer = async () => {
   const populateQuery = buildPopulateQuery(['seo.metaImage.url']);
   try {
      const response = await fetchClient('/disclaimer?' + populateQuery, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching disclaimer:', error);
      throw error;
   }
};

export const getCancellationPolicy = async () => {
   const populateQuery = buildPopulateQuery(['seo.metaImage.url']);
   try {
      const response = await fetchClient(
         '/cancellation-policy?' + populateQuery,
         {
            headers: getAuthHeaders(),
         },
      );
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
      // First try to get reports with view counts (if available)
      // Adjust fields to only get what you need for static generation
      const populateQuery = buildPopulateQuery(['slug']);
      const paginationQuery = getPaginationQuery(1, limit);

      // Try to sort by viewCount if it exists (fallback to publication date)
      let sortQuery = '&sort[0]=oldPublishedAt:desc';

      // You can add viewCount if it exists in your DB schema
      // sortQuery = '&sort[0]=viewCount:desc&sort[1]=oldPublishedAt:desc';

      const response = await fetchClient(
         '/reports?' + paginationQuery + '&' + populateQuery + sortQuery,
         {
            headers: getAuthHeaders(),
            next: {
               revalidate: 86400, // Revalidate daily
               tags: ['popular-reports'],
            },
         },
      );

      return response;
   } catch (error) {
      console.error('Error fetching most viewed reports:', error);

      // Fallback to getting the latest reports if the view-based query fails
      try {
         const populateQuery = buildPopulateQuery(['slug']);
         const paginationQuery = getPaginationQuery(1, limit);
         const sortQuery = '&sort[0]=oldPublishedAt:desc';

         const response = await fetchClient(
            '/reports?' + paginationQuery + '&' + populateQuery + sortQuery,
            {
               headers: getAuthHeaders(),
               next: {
                  revalidate: 86400, // Revalidate daily
               },
            },
         );

         return response;
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
export const getReportsPageBySlug = cache(
   async (slug: string, locale: string = 'en') => {
      console.log(slug, locale);
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
         const filterQuery = `?filters[slugCopy][$eq]=${encodeURIComponent(slug)}&locale=${encodeURIComponent(locale)}`;

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
   },
);
