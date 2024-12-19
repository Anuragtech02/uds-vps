export const SUPPORTED_LOCALES = [
   'en',
   'ru',
   'ar',
   'de',
   'fr',
   'zh-TW',
   'ja',
   'ko',
   'vi',
   'it',
   'pl',
   "zh-CN",
   "es",
] as const;

export const DEFAULT_LOCALE = 'en' as const;

export const CURRENCIES: {
   [key: string]: { symbol: string; name: string };
} = {
   USD: { symbol: '$', name: 'USD' },
   INR: { symbol: '₹', name: 'INR' },
   EUR: { symbol: '€', name: 'EUR' },
   GBP: { symbol: '£', name: 'GBP' },
   JPY: { symbol: '¥', name: 'JPY' },
};