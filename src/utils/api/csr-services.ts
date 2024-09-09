import fetchClientCSR from './csr-config';

function getAuthHeaders(type: 'get' | 'search' = 'get') {
    const token = type === 'search' ? process.env.NEXT_PUBLIC_SEARCH_TOKEN : process.env.NEXT_PUBLIC_API_TOKEN;
    if (token) {
       return {
          Authorization: `Bearer ${token}`,
       };
    }
    return undefined;
 }

export const searchContent = async (query: string, page: number, limit = 10) => {
    try {
       const response = await fetchClientCSR('/search?q='+query, {
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