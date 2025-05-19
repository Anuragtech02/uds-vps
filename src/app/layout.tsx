import '@/assets/styles/style.scss';
import Appwrapper from '@/components/Appwrapper';
import Script from 'next/script';
import HandleRTL from '@/components/commons/HandleRTL';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/utils/constants';
import { Bricolage_Grotesque, Manrope } from 'next/font/google';
import { GoogleTagManager } from '@next/third-parties/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import BackToTop from '@/components/BackToTop';
import { headers } from 'next/headers';
import { LocaleProvider } from '@/utils/LocaleContext';

export const runtime = 'nodejs';

const bricolageGrotesque = Bricolage_Grotesque({
   subsets: ['latin'],
   weight: ['200', '300', '400', '500', '600', '700', '800'],
   variable: '--font-bricolage-grotesque',
   display: 'swap',
});

const manrope = Manrope({
   subsets: ['latin'],
   variable: '--font-manrope',
   display: 'swap',
});

export async function generateStaticParams() {
   // Generate routes for all locales except default (en)
   return SUPPORTED_LOCALES.filter((locale) => locale !== 'en').map(
      (locale) => ({
         lang: locale,
      }),
   );
}

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   // In layout.tsx
   const serverHeaders = headers();
   const middlewarePathname = serverHeaders.get('x-middleware-pathname');
   const effectiveLocale =
      serverHeaders.get('x-middleware-locale') || DEFAULT_LOCALE;

   // Use the middleware-provided pathname directly if available
   let actualPathname = middlewarePathname || '/';

   // Log for debugging
   console.log(
      `RootLayout received: pathname=${actualPathname}, locale=${effectiveLocale}`,
   );

   return (
      <LocaleProvider locale={effectiveLocale}>
         <html
            lang={effectiveLocale}
            className={`${manrope.variable} ${bricolageGrotesque.variable} `}
         >
            <GoogleTagManager gtmId='GTM-5F572ZK' />
            <link
               rel='preconnect'
               href='https://d21aa2ghywi6oj.cloudfront.net'
            />
            <link
               rel='dns-prefetch'
               href='https://d21aa2ghywi6oj.cloudfront.net'
            />
            <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
            <link rel='icon' type='image/png' href='/favicon.png' />
            <body>
               <Appwrapper pathname={actualPathname}>{children}</Appwrapper>
               <BackToTop />
               <HandleRTL />
               <Script
                  id='gtranslate-settings'
                  defer
                  strategy='afterInteractive'
               >
                  {/* Russian(Ru), Arabic(AR), German(DE), French, Chinese(ZH-tw), Japanese(ja), Korean(KO), Vietnamese(Vi), Italian(It),Poland(pl) */}
                  {/* {`window.gtranslateSettings = {"default_language":"en","languages":["en","ru","ar","de","fr","zh-TW","zh-CN","ja","ko","vi","it","pl","es"],"wrapper_selector":".gtranslate_wrapper"}`} */}
               </Script>
               <Script
                  src='https://cdn.gtranslate.net/widgets/latest/dropdown.js'
                  defer
               ></Script>
               <Script id='tawk-api' defer type='text/javascript'>
                  {`   var Tawk_API = Tawk_API || {},
               Tawk_LoadStart = new Date();
               (function() {
               var s1 = document.createElement("script"),
               s0 = document.getElementsByTagName("script")[0];
               s1.async = true;
               s1.src = 'https://embed.tawk.to/60ed46e3649e0a0a5ccbed30/1fafdpr6a';
               s1.charset = 'UTF-8';
               s1.setAttribute('crossorigin', '*');
               s0.parentNode.insertBefore(s1, s0);
               })();`}
               </Script>
            </body>
            <GoogleAnalytics gaId='G-3BSS95LP56' />
         </html>
      </LocaleProvider>
   );
}
