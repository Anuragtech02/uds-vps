const baseURL = process.env.API_URL || 'http://127.0.0.1:1337';
const defaultTimeout = Number(process.env.FETCH_TIMEOUT) || 10000; // Default 10 seconds
const defaultRevalidate = Number(process.env.FETCH_REVALIDATE) || 3600 * 3; // Default 3 hours
const maxRetries = Number(process.env.FETCH_MAX_RETRIES) || 3; // Default 3 retries

const fetchClient = async <T = any>(
   url: string,
   options: any = {},
): Promise<T> => {
   const fullUrl = `${baseURL}${url}`;
   const attemptTimeout = options.timeout || defaultTimeout;
   const revalidateTime = options.revalidate ?? defaultRevalidate; // Allow '0' to disable revalidate
   const retries = options.retries ?? maxRetries;
   let currentRetry = 0;

   const defaultHeaders = {
      'Content-Type': 'application/json',
   };

   const config: RequestInit = {
      ...options,
      headers: {
         ...defaultHeaders,
         ...options.headers,
      },
      next: {
         revalidate: revalidateTime,
      },
   };

   async function performFetch(): Promise<Response> {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), attemptTimeout);

      try {
         const response = await fetch(fullUrl, {
            ...config,
            signal: controller.signal,
         });
         clearTimeout(timeoutId);
         return response;
      } finally {
         clearTimeout(timeoutId); // Ensure timeout is cleared even if fetch throws immediately
      }
   }

   async function handleResponse(response: Response): Promise<T> {
      if (!response.ok) {
         if (response.status === 401) {
            console.error(
               `Unauthorized access (401) for URL: ${fullUrl} - maybe redirect to login?`,
            );
         }
         const errorText = await response.text(); // Get error text from response
         throw new Error(
            `HTTP error! status: ${response.status}, URL: ${fullUrl}, Response body: ${errorText}`,
         );
      }
      return response.json() as Promise<T>; // Type assertion for return type
   }

   async function attemptFetchWithRetry(): Promise<T> {
      while (currentRetry <= retries) {
         try {
            const response = await performFetch();
            return handleResponse(response);
         } catch (error: any) {
            if (error.name === 'AbortError') {
               console.error(
                  `Fetch timeout after ${attemptTimeout}ms for URL: ${fullUrl}, Retry attempt: ${currentRetry + 1}/${retries + 1}`,
               );
            } else if (
               error.message.startsWith('HTTP error!') ||
               error.message.startsWith('Fetch error')
            ) {
               // Refine error checking
               console.error(
                  `Fetch error for URL: ${fullUrl}, Retry attempt: ${currentRetry + 1}/${retries + 1}, Error: ${error.message}`,
               );
            } else {
               console.error(
                  `Unexpected fetch error for URL: ${fullUrl}, Retry attempt: ${currentRetry + 1}/${retries + 1}, Error:`,
                  error,
               );
            }

            if (currentRetry < retries) {
               currentRetry++;
               const backoffDelay = Math.min(2 ** currentRetry * 100, 3000); // Exponential backoff (up to 3s)
               console.log(`Retrying in ${backoffDelay}ms...`);
               await new Promise((resolve) =>
                  setTimeout(resolve, backoffDelay),
               ); // Wait before retrying
            } else {
               console.error(
                  `Max retries (${retries}) reached for URL: ${fullUrl}. Fetch failed.`,
               );
               throw error; // Re-throw after max retries
            }
         }
      }
      throw new Error('Should not reach here - retry logic error'); // Should theoretically not be reachable
   }

   try {
      return await attemptFetchWithRetry();
   } catch (finalError) {
      console.error(
         `Final fetch error after retries for URL: ${fullUrl}:`,
         finalError,
      );
      throw finalError; // Re-throw the final error to be handled by the caller
   }
};

export default fetchClient;
