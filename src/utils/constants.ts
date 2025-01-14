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
   'zh-CN',
   'es',
] as const;

export const validRoutes = [
   'about-us',
   'blogs',
   'cart',
   'checkout',
   'contact-us',
   'login',
   'news',
   'payment-failure',
   'payment-success',
   'privacy-policy',
   'profile',
   'reports',
   'search',
   'services',
   'signup',
   'terms-and-conditions',
   'disclaimer',
   'legal',
   'not-found',
];

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

export const LOGO_URL_LIGHT =
   'https://udsweb.s3.ap-south-1.amazonaws.com/UDS_LOGO_White_fb96f6add9.png';
export const LOGO_URL_DARK =
   'https://udsweb.s3.ap-south-1.amazonaws.com/FUDS_Logo_no_BG_4f5a475221.png';
export const SEARCH_IMAGE_URL =
   'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fthumbnail_news.35db6797.jpg';

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
