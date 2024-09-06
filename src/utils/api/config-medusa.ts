const baseURL = process.env.NEXT_PUBLIC_MEDUSA_API || 'http://127.0.0.1:1337';
const medusaToken = process.env.NEXT_PUBLIC_MEDUSA_TOKEN;
const timeout = 10000;

const fetchClientMedusa = async (url: string, options: any = {}) => {
   const fullUrl = `${baseURL}${url}`;

   const defaultHeaders = {
      'Content-Type': 'application/json',
   };

   const config = {
      ...options,
      headers: {
         ...defaultHeaders,
         ...options.headers,
         'x-publishable-api-key': `${medusaToken}`,
      },
   };

   // Timeout promise
   const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout),
   );

   // Fetch request promise
   const fetchPromise = fetch(fullUrl, config).then(async (response) => {
      if (!response.ok) {
         if (response.status === 401) {
            console.error('Unauthorized access - maybe redirect to login?');
         }
         throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
   });

   // Use Promise.race to handle timeout
   try {
      return await Promise.race([fetchPromise, timeoutPromise]);
   } catch (error) {
      console.error('Fetch error:', error);
      throw error;
   }
};

export default fetchClientMedusa;
