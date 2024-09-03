import { cookies } from 'next/headers';

import API from './config';
import { buildPopulateQuery } from '../generic-methods';
import fetchClient from './config';

function getAuthHeaders() {
   const cookieStore = cookies();
   if (cookieStore.get('authorization')) {
      const authHeader = cookieStore.get('authorization')?.value;
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
      ]);
      const response = await fetchClient('/home-page' + populateQuery, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
   }
};
