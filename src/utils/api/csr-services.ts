import { CURRENCIES } from '../constants';
import { buildPopulateQuery } from '../generic-methods';
import fetchClientCSR from './csr-config';

function getAuthHeaders(type: 'get' | 'search' | 'post' = 'get') {
   const token =
      '127001e645bc65923f9729a31a7b65654a744938bc6eb8a4695a3bef3a1c5f67ff390b2d05e4554861aeeed173375fd0506a53f85c29727c91cdb1ff62cb9e516f8396c7393e2bdd145e834d4f47ab688ea13991596ae9e3d05f1f007b0b1a2fac5f3cc0068652f3d685d65e9854a5106a1af9291708f1c784df6c2f21d27c29';
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

export const getBlogsListingPageClient = async (
   page = 1,
   limit = 10,
   filters = {},
) => {
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
      const query = `${populateQuery}&${paginationQuery}&${filterQuery}&${sortQuery}`;
      const response = await fetchClientCSR('/blogs?' + query, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching Blogs:', error);
      throw error;
   }
};

export const getNewsListingPageClient = async (
   page = 1,
   limit = 10,
   filters = {},
) => {
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
      const query = `${populateQuery}&${paginationQuery}&${filterQuery}&${sortQuery}`;
      const response = await fetchClientCSR('/news-articles?' + query, {
         headers: getAuthHeaders(),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching News:', error);
      throw error;
   }
};
