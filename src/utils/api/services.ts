import { cookies } from 'next/headers';

import API from './config';
import { buildPopulateQuery } from '../generic-methods';
import fetchClient from './config';

function getAuthHeaders() {
   const cookieStore = cookies();
   if (cookieStore.get('authorization')) {
      const authHeader = cookieStore.get('authorization')?.value;
      console.log('authHeader', authHeader);
      return {
         Authorization: `Bearer ${authHeader}`,
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
