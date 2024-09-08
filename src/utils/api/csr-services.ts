import API from './csr-config';

export const getProducts = async () => {
   try {
      const response = await API.get('/products');
      return response.data;
   } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
   }
};

export const signup = async (data: any) => {
   try {
      const response = await API.post('/auth/local/register', data);
      return response.data;
   } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
   }
};
export const login = async (data: any) => {
   try {
      const response = await API.post('/auth/local', data);
      return response.data;
   } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
   }
};
