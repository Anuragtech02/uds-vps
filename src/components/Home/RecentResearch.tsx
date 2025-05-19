'use client';
import ResearchCard from '../ResearchCard';
import sampleImage from '@/assets/img/sampleResearch.png';
import { getAllReportsCSR } from '@/utils/api/csr-services';
import { getRecentReports } from '@/utils/cache-recent-reports.utils';
import { getFormattedDate } from '@/utils/generic-methods';
import { TRANSLATED_VALUES } from '@/utils/localeConstants';
import { useLocale } from '@/utils/LocaleContext';
import { useEffect, useState } from 'react';

const RecentResearch: React.FC<{ data: any }> = ({ data }) => {
   const [reports, setReports] = useState<any>([]);
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   const { locale } = useLocale();

   useEffect(() => {
      // Initialize with cached data if available
      const cachedReports = getRecentReports();
      if (cachedReports?.length) {
         setReports(cachedReports);
      }
   }, []);

   useEffect(() => {
      const loadRecentReports = async () => {
         setIsLoading(true);
         setError(null);

         try {
            const storedReports = getRecentReports() || [];
            console.log('Stored reports from local storage:', storedReports);

            if (storedReports.length === 0) {
               setIsLoading(false);
               return;
            }

            // Extract all unique slugs to fetch - handle both formats
            const slugsToFetch = storedReports
               .filter((report: any) => report?.slug || report?.reportID)
               .map((report: any) => report?.slug || report?.reportID);

            console.log('Slugs to fetch:', slugsToFetch);

            // If no slugs to fetch, exit early but use local storage data
            if (slugsToFetch.length === 0) {
               console.warn(
                  'No valid slugs found in stored reports, using local data as is',
               );
               setReports(storedReports);
               setIsLoading(false);
               return;
            }

            // Format filters according to Strapi documentation
            // For multiple values: filters[slug][$in][0]=value1&filters[slug][$in][1]=value2...

            // Create params object with correct structure for multiple values
            const requestParams: any = {
               page: 1,
               limit: slugsToFetch.length,
               locale: locale,
               // Use an appropriate sort option
               sortBy: 'oldPublishedAt:desc',
            };

            // Properly format the $in operator for multiple values
            slugsToFetch.forEach((slug: string, index: number) => {
               requestParams[`filters[slug][$in][${index}]`] = slug;
            });

            try {
               // Let's create a manual direct query URL to see exactly what parameters
               // are needed for Strapi
               const manualQueryParams: string[] = [];

               // Add filter parameters for each slug
               slugsToFetch.forEach((slug: string, index: number) => {
                  manualQueryParams.push(
                     `filters[slug][$in][${index}]=${encodeURIComponent(slug)}`,
                  );
               });

               // Add other parameters
               manualQueryParams.push(`locale=${locale}`);
               manualQueryParams.push(`pagination[page]=1`);
               manualQueryParams.push(
                  `pagination[pageSize]=${slugsToFetch.length}`,
               );
               manualQueryParams.push(`sort[0]=oldPublishedAt:desc`);

               const manualQueryString = manualQueryParams.join('&');

               const response = await getAllReportsCSR(requestParams);

               if (response?.data?.length) {
                  const localizedReports = response.data.map((report: any) => ({
                     ...report,
                     storedLocale: locale,
                  }));

                  setReports(localizedReports);
               } else {
                  // Alternative approach:
                  // 2. Try a direct fetch to the endpoint with our manually constructed query
                  console.log(
                     'API returned empty results, trying direct fetch',
                  );

                  // This is a simplified version - you'll need to adjust the base URL and headers
                  // to match your actual API configuration
                  try {
                     // Get the base URL from your environment or configuration
                     const baseUrl = '/api/reports'; // Adjust this to your actual API base URL
                     const url = `${baseUrl}?${manualQueryString}`;

                     console.log('Attempting direct fetch to:', url);

                     // Use your authentication headers from elsewhere in the app
                     const getAuthHeaders = () => ({
                        // Add your auth headers here if needed
                     });

                     const directResponse = await fetch(url, {
                        headers: getAuthHeaders(),
                        next: {
                           revalidate: 3600,
                           tags: ['reports'],
                        },
                     });

                     if (!directResponse.ok) {
                        throw new Error(
                           `Direct fetch failed with status: ${directResponse.status}`,
                        );
                     }

                     const directData = await directResponse.json();

                     if (directData?.data?.length) {
                        const directLocalizedReports = directData.data.map(
                           (report: any) => ({
                              ...report,
                              storedLocale: locale,
                           }),
                        );

                        setReports(directLocalizedReports);
                     } else {
                        console.warn(
                           'Both approaches returned empty data - using stored reports as fallback',
                        );
                        setReports(storedReports);
                     }
                  } catch (directFetchError) {
                     console.error('Direct fetch failed:', directFetchError);
                     console.warn(
                        'Using local storage data as fallback due to direct fetch error',
                     );
                     setReports(storedReports);
                  }
               }

               if (response?.data?.length) {
                  const localizedReports = response.data.map((report: any) => ({
                     ...report,
                     storedLocale: locale,
                  }));

                  setReports(localizedReports);
               } else {
                  console.warn(
                     'API returned empty data - using stored reports as fallback',
                  );
                  setReports(storedReports);
               }
            } catch (apiError) {
               console.error('API request failed:', apiError);
               console.warn(
                  'Using local storage data as fallback due to API error',
               );
               setReports(storedReports);
            }
         } catch (error) {
            console.error('Error processing recent reports:', error);

            // Fallback to cached reports on error
            const cachedReports = getRecentReports();
            if (cachedReports?.length) {
               setReports(cachedReports);
               console.log('Using cached reports as fallback');
            }
         } finally {
            setIsLoading(false);
         }
      };

      loadRecentReports();
   }, [locale]); // Re-run effect when locale changes

   // Helper function to adapt a report to the expected structure for ResearchCard
   const adaptReportForCard = (report: any) => {
      // For reports from local storage (flat structure)
      if (!report.attributes) {
         return {
            id: report.reportID || report.id,
            slug: report.slug || report.reportID,
            title: report.title,
            image: report.highlightImage?.data?.attributes || {
               url: sampleImage.src,
               alternativeText: 'Placeholder',
            },
            date: report.publishedAt || report.oldPublishedAt,
            year: getYearFromReport(report),
         };
      }

      // For reports from API (with attributes)
      return {
         id: report.id,
         slug: report.attributes?.slug || report.slug,
         title: report.attributes?.title,
         image: report.attributes?.highlightImage?.data?.attributes || {
            url: sampleImage.src,
            alternativeText: 'Placeholder',
         },
         date: getFormattedDate(report.attributes, locale),
         year: getYearFromReport(report),
      };
   };

   // Modified version of getYear to handle both data structures
   function getYearFromReport(report: any) {
      // Handle both report formats (API response with attributes or local storage format)
      if (report.attributes) {
         // API format
         const oldPublishedAt = report.attributes.oldPublishedAt;
         const publishedAt = report.attributes.publishedAt;

         if (
            oldPublishedAt &&
            new Date(oldPublishedAt).toString() !== 'Invalid Date'
         ) {
            return new Date(oldPublishedAt).getFullYear().toString();
         }

         if (
            publishedAt &&
            new Date(publishedAt).toString() !== 'Invalid Date'
         ) {
            return new Date(publishedAt).getFullYear().toString();
         }
      } else {
         // Local storage format
         const oldPublishedAt = report.oldPublishedAt;
         const publishedAt = report.publishedAt;

         if (
            oldPublishedAt &&
            new Date(oldPublishedAt).toString() !== 'Invalid Date'
         ) {
            return new Date(oldPublishedAt).getFullYear().toString();
         }

         if (
            publishedAt &&
            new Date(publishedAt).toString() !== 'Invalid Date'
         ) {
            return new Date(publishedAt).getFullYear().toString();
         }
      }

      // Default to current year if no valid date is available
      return new Date().getFullYear().toString();
   }

   const recentResearchSection = {
      recentResearchSectionTitle:
         data?.data?.attributes?.recentResearchSectionTitle ||
         TRANSLATED_VALUES[locale]?.home?.recentlyViewedReports,
      recentResearchSectionReportsCount: reports?.length || 0,
   };

   // Return null if no reports and not loading
   if (!isLoading && reports?.length < 1) return null;

   if (isLoading) {
      return (
         <section className='min-h-full pb-0 pt-10 md:pt-8'>
            <div className='container'>
               <p>Loading recent reports...</p>
            </div>
         </section>
      );
   }

   return (
      <section className='min-h-full pb-0 pt-10 md:pt-8'>
         <div className='container'>
            <h2
               dangerouslySetInnerHTML={{
                  __html: recentResearchSection.recentResearchSectionTitle,
               }}
            />
            {error && (
               <p className='mb-2 text-sm text-yellow-500'>
                  {error} Showing cached results.
               </p>
            )}
            <div className='my-8 md:my-10 md:mb-0'>
               <div className='grid grid-cols-2 gap-4 md:grid-cols-5'>
                  {reports.map((report: any, index: number) => {
                     // Adapt the report to a consistent format for the card
                     const adaptedReport = adaptReportForCard(report);
                     const { id, slug, title, image, date, year } =
                        adaptedReport;

                     // Skip rendering if missing critical data
                     if (!title || (!slug && !id)) {
                        console.warn(
                           `Skipping report at index ${index} due to missing critical data:`,
                           report,
                        );
                        return null;
                     }

                     return (
                        <div key={id || slug || index}>
                           <ResearchCard
                              type='latest'
                              title={title}
                              slug={slug}
                              year={year}
                              image={image}
                              date={date}
                              locale={locale}
                           />
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>
      </section>
   );
};

export default RecentResearch;
