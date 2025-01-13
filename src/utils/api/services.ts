import { cookies } from 'next/headers';

import API from './config';
import { buildPopulateQuery } from '../generic-methods';
import fetchClient from './config';

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

export const getReportsPageBySlug = async (slug: string) => {
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
         },
      );
      return await response;
   } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
   }
};

export const getAllReports = async (page = 1, limit = 10, filters = {}) => {
   try {
      const populateQuery = buildPopulateQuery([
         'industry.name',
         'geography.name',
         'highlightImage.url',
      ]);
      const paginationQuery = getPaginationQuery(page, limit);
      const filterQuery = getFilterQuery(filters);
      const sortQuery = 'sort[0]=oldPublishedAt:desc';
      const query = `${populateQuery}&${paginationQuery}&${filterQuery}&${sortQuery}`;
      
      const response = await fetchClient('/reports?' + query, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
   }
};

export const getNewsListingPage = async (
   page = 1,
   limit = 10,
   filters = {},
) => {
   try {
      const populateQuery = buildPopulateQuery([
         'industry.name',
         'thumbnailImage.url',
         'author.name',
         'oldPublishedAt'
      ]);
      const paginationQuery = getPaginationQuery(page, limit);
      const filterQuery = getFilterQuery(filters);
      const sortQuery = 'sort[0]=oldPublishedAt:desc';
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
) => {
   try {
      const populateQuery = buildPopulateQuery([
         'industry.name',
         'thumbnailImage.url',
         'author.name',
         'oldPublishedAt'
      ]);
      const paginationQuery = getPaginationQuery(page, limit);
      const filterQuery = getFilterQuery(filters);
      const sortQuery = 'sort[0]=oldPublishedAt:desc';
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

export const getIndustries = async (page = 1, limit = 100) => {
   try {
      const paginationQuery = getPaginationQuery(page, limit);
      const response = await fetchClient('/industries?' + paginationQuery, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching Industries:', error);
      throw error;
   }
};

export const getGeographies = async (page = 1, limit = 100) => {
   try {
      const paginationQuery = getPaginationQuery(page, limit);
      const response = await fetchClient('/geographies?' + paginationQuery, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching Geographies:', error);
      throw error;
   }
};

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
      return await response;
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
      },);
      return await response;
   } catch (error) {
      console.error('Error fetching privacy policy:', error);
      throw error;
   }
}

export const getTermsAndConditions = async () => {
   try {
      const response = await fetchClient('/t-and-c',{
         headers: getAuthHeaders(),
      },);
      return await response;
   } catch (error) {
      console.error('Error fetching terms and conditions:', error);
      throw error;
   }
}

export const getLegal = async () => {
   try {
      const response = await fetchClient('/legal',{
         headers: getAuthHeaders(),
      },);
      return await response;
   } catch (error) {
      console.error('Error fetching legal:', error);
      throw error;
   }
}

export const getDisclaimer = async () => {
   try {
      const response = await fetchClient('/disclaimer',{
         headers: getAuthHeaders(),
      },);
      return await response;
   } catch (error) {
      console.error('Error fetching disclaimer:', error);
      throw error;
   }
}