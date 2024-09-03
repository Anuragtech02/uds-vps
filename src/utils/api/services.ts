// utils/api/services.ts

import type { NextConfig } from 'next';
import API from './config';

function getAuthHeaders(context: NextConfig) {
   if (context?.req?.headers) {
      const authHeader = context.req.headers.authorization;
      return {
         Authorization: `Bearer ${authHeader}`,
      };
   }
   return undefined;
}

export const getProducts = async (context: NextConfig) => {
   try {
      const response = await API.get('/home-page', {
         headers: getAuthHeaders(context),
      });
      return response.data;
   } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
   }
};
