import type { Config } from 'tailwindcss';

const config: Config = {
   content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
   ],
   theme: {
      extend: {
         colors: {
            green: {
               1: '#009090',
               2: '#1EAEAE',
               3: '#3CCCCC',
               4: '#5AEAEA',
               5: '#78FFFF',
               6: '#A0FFFF',
               7: '#BEFFFF',
               8: '#DCFFFC',
            },
            blue: {
               1: '#09184C',
               2: '#1D2C60',
               3: '#314074',
               4: '#455488',
               5: '#59689C',
               6: '#7786BA',
               7: '#95A4D8',
               8: '#B3C2F6',
               9: '#D1E0FF',
            },
            s: {
               50: '#f8fafc',
               100: '#f1f5f9',
               200: '#E2E8F0',
               300: '#CBD5E1',
               400: '#94a3b8',
               500: '#64748b',
               600: '#475569',
               700: '#334155',
               800: '#1e293b',
               900: '#0f172a',
               950: '#020617',
            },
         },
         fontFamily: {
            bricolage: ['var(--font-bricolage-grotesque)'],
            manrope: ['var(--font-manrope)'],
         },
      },
   },
   plugins: [],
};
export default config;
