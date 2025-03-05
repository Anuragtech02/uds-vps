import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/utils/constants';
import type { Metadata } from 'next';

export async function generateStaticParams() {
   // Generate routes for all locales except default (en)
   return SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map(
      (locale) => ({
         lang: locale,
      }),
   );
}

export default function RootLayout({
   children,
   params: { lang },
}: Readonly<{
   children: React.ReactNode;
   params: { lang: string };
}>) {
   return <>{children}</>;
}
