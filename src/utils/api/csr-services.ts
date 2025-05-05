import { CURRENCIES } from '../constants';
import { buildPopulateQuery } from '../generic-methods';
import fetchClientCSR from './csr-config';

function getAuthHeaders(type: 'get' | 'search' | 'post' = 'get') {
   const token =
      type === 'search'
         ? process.env.NEXT_PUBLIC_SEARCH_TOKEN
         : type === 'post'
           ? process.env.NEXT_PUBLIC_POST_TOKEN
           : process.env.NEXT_PUBLIC_API_TOKEN;
   if (token) {
      return {
         Authorization: `Bearer ${token}`,
      };
   }
   return undefined;
}

export interface ContactFormData {
   fullName: string;
   businessEmail: string;
   company: string;
   message: string;
   mobileNumber: string;
   cfTurnstileResponse: string;
}

export const searchContent = async (
   query: string,
   page: number,
   limit = 10,
   options?: {
      industries?: string[];
      geographies?: string[];
      sortBy?: string;
   },
) => {
   try {
      const params = new URLSearchParams({
         q: query,
         page: page.toString(),
         limit: limit.toString(),
         ...(options?.industries?.length
            ? { industries: options.industries.join(',') }
            : {}),
         ...(options?.geographies?.length
            ? { geographies: options.geographies.join(',') }
            : {}),
         ...(options?.sortBy ? { sortBy: options.sortBy } : {}),
      });

      const response = await fetchClientCSR(`/search?${params.toString()}`, {
         headers: getAuthHeaders('search'),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching search results:', error);
      throw error;
   }
};

// export const getProducts = async () => {
//    try {
//       const response = await API.get('/products');
//       return response.data;
//    } catch (error) {
//       console.error('Error fetching products:', error);
//       throw error;
//    }
// };

export const signup = async (data: any) => {
   try {
      const response = await fetchClientCSR('/auth/local/register', {
         method: 'POST',
         body: JSON.stringify(data),
         headers: {
            'Content-Type': 'application/json',
         },
      });
      return response.data;
   } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
   }
};

export const login = async (data: any) => {
   try {
      const response = await fetchClientCSR('/auth/local', {
         method: 'POST',
         body: JSON.stringify(data),
         headers: {
            'Content-Type': 'application/json',
         },
      });
      return response.data;
   } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
   }
};

export const submitForm = async (
   type: 'contact' | 'enquiry' | 'demo' | 'callback',
   data: any,
) => {
   try {
      const response = await fetchClientCSR(`/${type}-form-submissions`, {
         method: 'POST',
         body: JSON.stringify({ data }),
         headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders('post'),
         },
      });
      return response.data;
   } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
   }
};

// API endpoints
const ENDPOINTS = {
   orders: '/orders',
   payments: '/payments',
};

// Create a new order
export const createOrder = async (orderData: any) => {
   try {
      const response = await fetchClientCSR(ENDPOINTS.orders, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders('post'),
         },
         body: JSON.stringify({
            data: {
               ...orderData,
               fullfillmentStatus: 'INITIATED',
            },
         }),
      });
      return await response;
   } catch (error) {
      console.error('Error creating order:', error);
      throw error;
   }
};

export const createOrderIdFromRazorPay = async (
   amount: number,
   currency: keyof typeof CURRENCIES = 'USD',
) => {
   try {
      const response = await fetchClientCSR('/rpay/create-order', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders('post'),
         },
         body: JSON.stringify({
            amount: amount,
            currency: currency,
         }),
      });

      const data = await response;
      return {
         orderId: data.orderId,
         receipt: data.receipt,
      };
   } catch (error) {
      console.error('There was a problem while creating order:', error);
   }
};

export const verifyPayments = async (body: any) => {
   try {
      const response = await fetchClientCSR('/rpay/verify', {
         method: 'POST',
         body: JSON.stringify(body),
         headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders('post'),
         },
      });
      return response;
   } catch (error) {
      console.error('There was a problem while verifying payments:', error);
   }
};

// Update order status
export const updateOrderStatus = async (orderId: number, status: string) => {
   try {
      const response = await fetchClientCSR(`${ENDPOINTS.orders}/${orderId}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders('post'),
         },
         body: JSON.stringify({
            data: {
               fullfillmentStatus: status,
            },
         }),
      });
      return await response;
   } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
   }
};

// Get order by ID
export const getOrder = async (orderId: number) => {
   try {
      const response = await fetchClientCSR(
         `${ENDPOINTS.orders}/${orderId}?populate=*`,
         {
            headers: {
               'Content-Type': 'application/json',
               ...getAuthHeaders('post'),
            },
         },
      );
      return await response;
   } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
   }
};

// Create payment for order
export const createPayment = async (paymentData: any) => {
   try {
      const response = await fetchClientCSR(ENDPOINTS.payments, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders('post'),
         },
         body: JSON.stringify({
            data: {
               ...paymentData,
               provider: 'RAZORPAY',
               fullfillmentStatus: 'INITIATED',
            },
         }),
      });
      return await response;
   } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
   }
};

// Update payment status
export const updatePaymentStatus = async (
   paymentId: number,
   status: string,
) => {
   try {
      const response = await fetchClientCSR(
         `${ENDPOINTS.payments}/${paymentId}`,
         {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               ...getAuthHeaders('post'),
            },
            body: JSON.stringify({
               data: {
                  fullfillmentStatus: status,
               },
            }),
         },
      );
      return await response;
   } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
   }
};

export const getCurrencyRates = async () => {
   try {
      const response = await fetchClientCSR('/currency-rates?from=USD', {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching currency rates:', error);
      throw error;
   }
};

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

interface BlogsListingConfig {
   page?: number;
   limit?: number;
   filters?: Record<string, string | number | boolean>;
   locale?: string;
}

export const getBlogsListingPageClient = async ({
   page = 1,
   limit = 10,
   filters = {},
   locale = 'en',
}: BlogsListingConfig) => {
   try {
      const populateQuery = buildPopulateQuery([
         'industry.name',
         'thumbnailImage.url',
         'author.name',
         'oldPublishedAt',
      ]);
      const paginationQuery = getPaginationQuery(page, limit);
      const filterQuery = getFilterQuery(filters);
      const sortQuery = 'sort[0]=oldPublishedAt:desc';
      const localeQuery = `&locale=${encodeURIComponent(locale)}`;
      const query = `${populateQuery}&${paginationQuery}&${filterQuery}&${sortQuery}${localeQuery}`;
      const response = await fetchClientCSR('/blogs?' + query, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching Blogs:', error);
      throw error;
   }
};

interface NewsListingConfig {
   page?: number;
   limit?: number;
   filters?: Record<string, string | number | boolean>;
   locale?: string;
}

export const getNewsListingPageClient = async ({
   page = 1,
   limit = 10,
   filters = {},
   locale = 'en',
}: NewsListingConfig) => {
   try {
      const populateQuery = buildPopulateQuery([
         'industry.name',
         'thumbnailImage.url',
         'author.name',
         'oldPublishedAt',
      ]);
      const paginationQuery = getPaginationQuery(page, limit);
      const filterQuery = getFilterQuery(filters);
      const sortQuery = 'sort[0]=oldPublishedAt:desc';
      const query = `${populateQuery}&${paginationQuery}&${filterQuery}&${sortQuery}&locale=${encodeURIComponent(locale)}`;
      const response = await fetchClientCSR('/news-articles?' + query, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching News:', error);
      throw error;
   }
};

export const getAllReportsCSR = async ({
   page = 1,
   limit = 10,
   filters = {},
   sortBy = 'relevance',
   locale = 'en',
} = {}) => {
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
      const localeQuery = locale ? `&locale=${locale}` : '';
      const query = [
         populateQuery,
         paginationQuery,
         filterQuery,
         sortQuery,
         localeQuery,
      ]
         .filter(Boolean)
         .join('&');

      const response = await fetchClientCSR('/reports?' + query, {
         headers: getAuthHeaders(),
         next: {
            revalidate: 3600, // Revalidate cached data hourly
            tags: ['reports'], // Tag for manual revalidation
         },
      });
      return await response;
   } catch (error) {
      console.error('Error fetching all reports:', error);
      throw error;
   }
};
