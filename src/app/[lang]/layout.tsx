import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/utils/constants';

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
