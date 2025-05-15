import { Variant } from '@/components/Report/ReportBlock';

export const SUPPORTED_LOCALES = [
   'en',
   'ru',
   'ar',
   'de',
   'fr',
   'zh-Hant-TW',
   'ja',
   'ko',
   'vi',
   'it',
   'pl',
   'zh-CN',
   'es',
] as const;

export const LOCALE_NAMES = [
   { locale: 'en', title: 'English' },
   { locale: 'ru', title: 'Russian' },
   { locale: 'ar', title: 'Arabic' },
   { locale: 'de', title: 'German' },
   { locale: 'fr', title: 'French' },
   { locale: 'zh-Hant-TW', title: 'Traditional Chinese' },
   { locale: 'ja', title: 'Japanese' },
   { locale: 'ko', title: 'Korean' },
   { locale: 'vi', title: 'Vietnamese' },
   { locale: 'it', title: 'Italian' },
   { locale: 'pl', title: 'Polish' },
   { locale: 'zh-CN', title: 'Simplified Chinese' },
   { locale: 'es', title: 'Spanish' },
];

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
   'cancellation-policy',
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
   'https://udsweb.s3.ap-south-1.amazonaws.com/UDS_Logo_no_BG_fa9627d31f.png';
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

export const DEFAULT_VARIANTS: Variant[] = [
   {
      title: 'Single User License',
      description: `<ul>
    <li>
        Report accessible by Purchaser Only
    </li>
    <li>
        Pre-Post Sale Support
    </li>
    <li>
        24 Hours Analyst Support
    </li>
    <li>
        Direct Access to Lead Analysts<br>
        &nbsp;
    </li>
</ul>`,
      price: {
         amount: 3999,
         currency: 'USD',
      },
   },
   {
      title: 'Site License',
      description: `<ul>
    <li>
        Report accessible among 5 Users including the Purchaser
    </li>
    <li>
        Pre-Post Sale Support
    </li>
    <li>
        32 Hours Analyst Support
    </li>
    <li>
        Direct Access to Lead Analysts
    </li>
    <li>
        10% Discount on next purchase
    </li>
    <li>
        Dedicated Point of Contact
    </li>
    <li>
        Permission to Print the Report<br>
        &nbsp;
    </li>
</ul>`,
      price: {
         amount: 5499,
         currency: 'USD',
      },
   },
   {
      title: 'Global License',
      description: `<ul>
    <li>
        Unlimited User Access
    </li>
    <li>
        Pre-Post Sale Support
    </li>
    <li>
        40 Hours Analyst Support
    </li>
    <li>
        Direct Access to Lead Analysts
    </li>
    <li>
        20% Discount on next purchase
    </li>
    <li>
        Dedicated Point of Contact
    </li>
    <li>
        Permission to Print the Report
    </li>
    <li>
        Market Data Sheet in Excel (free)<br>
        &nbsp;
    </li>
</ul>`,
      price: {
         amount: 6999,
         currency: 'USD',
      },
   },
];

export const INDUSTRY_MAP: {
   [key: string]: string;
} = {
   'energy-power': 'energy-and-power',
   'consumer-goods-news': 'consumer-goods',
   'automotive-news': 'automotive',
   'electronics-semiconductor-news': 'electronics-semiconductor',
   'healthcare-news': 'healthcare',
   'telecom-it-news': 'telecom-it',
   'artificial-intelligence': 'artificial-intelligence-analytics',
   'electronics-semiconductor': 'electronics-semiconductor',
   'media-entertainment-blog': 'media-entertainment',
   'agriculture-food-tech': 'agriculture',
   'consumer-goods': 'consumer-goods',
   'advance-materials-chemicals': 'chemical',
   'telecom-it': 'telecom-it',
   healthcare: 'healthcare',
   automotive: 'automotive',
};
