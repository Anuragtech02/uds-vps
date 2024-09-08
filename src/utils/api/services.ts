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

export const getNewsListingPage = async () => {
   try {
      const response = await fetchClient('/news-articles', {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching News:', error);
      throw error;
   }
};

export const getBlogsListingPage = async () => {
   try {
      const response = await fetchClient('/blogs', {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching News:', error);
      throw error;
   }
};
export const getIndustries = async () => {
   try {
      const response = await fetchClient('/industries', {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching News:', error);
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

export const getAllServices = async () => {
   try {
      const populateQuery = buildPopulateQuery([
         'highlightImage.url',
      ]);
      const response = await fetchClient('/services?' + populateQuery, {
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
      const populateQuery = buildPopulateQuery([
         'highlightImage.url'
      ]);
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