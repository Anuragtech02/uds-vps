// app/sitemap/route.ts
import { headers } from 'next/headers';

// export const runtime = 'edge'
export const dynamic = 'force-dynamic';

export async function GET() {
   try {
      // Fetch the sitemap from your Strapi instance
      const response = await fetch(
         `${'https://web-server-india.univdatos.com/api'}/sitemap.xml`,
         {
            next: { revalidate: 3600 }, // Revalidate every hour
            headers: {
               Accept: 'application/xml',
            },
         },
      );

      if (!response.ok) {
         throw new Error('Failed to fetch sitemap');
      }

      const sitemap = await response.text();

      // Return the sitemap with proper XML headers
      return new Response(sitemap, {
         headers: {
            'Content-Type': 'application/xml',
            'Cache-Control':
               'public, max-age=0, s-maxage=3600, stale-while-revalidate',
         },
      });
   } catch (error) {
      console.error('Error fetching sitemap:', error);
      return new Response('Error generating sitemap', {
         status: 500,
         headers: {
            'Content-Type': 'text/plain',
         },
      });
   }
}
