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

export const SLICK_COMMON_SETTINGS = {
   dots: false,
   infinite: true,
   slidesToShow: 4,
   slidesToScroll: 1,
   arrows: false,
   dynamicHeight: false,
   autoplay: true,
   autoplaySpeed: 0,
   pauseOnFocus: true, 
   speed: 8000,
   cssEase: 'linear',
   pauseOnHover: true,
   responsive: [
      {
         breakpoint: 1200,
         settings: {
            slidesToShow: 3,
            // slidesToScroll: 1,
            infinite: true,
            dots: false,
         },
      },
      {
         breakpoint: 1024,
         settings: {
            slidesToShow: 3,
            // slidesToScroll: 1,
            infinite: true,
            dots: false,
         },
      },
      {
         breakpoint: 786,
         settings: {
            slidesToShow: 2,
            // slidesToScroll: 2,
         },
      },
      {
         breakpoint: 600,
         settings: {
            slidesToShow: 2,
            // slidesToScroll: 2,
         },
      },
      {
         breakpoint: 480,
         settings: {
            slidesToShow: 1,
            // slidesToScroll: 1,
         },
      },
   ],
};