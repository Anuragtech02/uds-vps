const baseURL = 'https://web-server-india.univdatos.com/api';
const timeout = 50000;

const fetchClient = async (url: string, options: any = {}) => {
   const fullUrl = `${baseURL}${url}`;

   const defaultHeaders = {
      'Content-Type': 'application/json',
      'User-Agent':
         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept:
         'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
   };

   const config = {
      ...options,
      headers: {
         ...defaultHeaders,
         ...options.headers,
      },
      next: {
         revalidate: 3600 * 3,
      },
   };

   // Timeout promise
   const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
         () => reject(new Error('Request timed out custom hai ye')),
         timeout,
      ),
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

export default fetchClient;
