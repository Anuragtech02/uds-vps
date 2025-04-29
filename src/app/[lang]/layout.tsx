import Appwrapper from '@/components/Appwrapper';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/utils/constants';
import { LocaleProvider } from '@/utils/LocaleContext';
import { headers } from 'next/headers';

export async function generateStaticParams() {
   // Generate routes for all locales except default (en)
   return SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map(
      (locale) => ({
         lang: locale,
      }),
   );
}

export default function LangLayout({
   children,
}: {
   children: React.ReactNode;
   params: { lang: string };
}) {
   return <>{children}</>;
}
