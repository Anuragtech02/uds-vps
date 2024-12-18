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

export const searchContent = async (
   query: string,
   page: number,
   limit = 10,
) => {
   try {
      const response = await fetchClientCSR('/search?q=' + query, {
         headers: getAuthHeaders('search'),
      });
      return await response;
   } catch (error) {
      console.error('Error fetching News:', error);
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

export const submitContactForm = async (data: any) => {
   try {
      const response = await fetchClientCSR('/contact-form-submissions', {
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

export const submitEnquiryForm = async (data: any) => {
   try {
      const response = await fetchClientCSR('/enquiry-form-submissions', {
         method: 'POST',
         body: JSON.stringify(data),
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
}