// contexts/LocaleContext.tsx
'use client'; // Context needs to be used by client components

import { createContext, useContext } from 'react';
import { DEFAULT_LOCALE } from '@/utils/constants'; // Import your default locale

interface LocaleContextProps {
   locale: string;
}

export const LocaleContext = createContext<LocaleContextProps>({
   locale: DEFAULT_LOCALE, // Default value
});

export const useLocale = () => useContext(LocaleContext);

// Optional: Provider component for cleaner usage in layouts
interface LocaleProviderProps {
   children: React.ReactNode;
   locale: string;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({
   children,
   locale,
}) => {
   return (
      <LocaleContext.Provider value={{ locale }}>
         {children}
      </LocaleContext.Provider>
   );
};
