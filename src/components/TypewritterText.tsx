'use client';
import { SUPPORTED_LOCALES } from '@/utils/constants';
import { useLocale } from '@/utils/LocaleContext';
import { useState, useEffect, useCallback } from 'react';

const DUMMY_MARKETS = [
   'Energy Market',
   'Aerospace Market',
   'Automotive Market',
   'Agriculture Market',
   'Telecom & IT Market',
   'Chemical Market',
];

const TypewriterText: React.FC<{
   markets: string[];
   heading: string;
}> = ({ markets = DUMMY_MARKETS, heading }) => {
   const [text, setText] = useState('');
   const [marketIndex, setMarketIndex] = useState(0);
   const [isDeleting, setIsDeleting] = useState(false);

   const typeSpeed = 100;
   const deleteSpeed = 50;
   const pauseBeforeDelete = 2000;
   const pauseBeforeNextWord = 500;

   const typeEffect = useCallback(() => {
      const currentMarket = markets[marketIndex];

      if (isDeleting) {
         setText(currentMarket.substring(0, text.length - 1));
      } else {
         setText(currentMarket.substring(0, text.length + 1));
      }

      if (!isDeleting && text === currentMarket) {
         setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
      } else if (isDeleting && text === '') {
         setIsDeleting(false);
         setMarketIndex((prevIndex) => (prevIndex + 1) % markets.length);
         setTimeout(() => {}, pauseBeforeNextWord);
      }
   }, [text, marketIndex, isDeleting]);

   useEffect(() => {
      const timer = setTimeout(
         typeEffect,
         isDeleting ? deleteSpeed : typeSpeed,
      );
      return () => clearTimeout(timer);
   }, [typeEffect, isDeleting]);

   function getHeadingTextSplit() {
      const splitted = heading.split('<DYNAMIC>');
      return {
         first: splitted[0],
         second: splitted[1],
      };
   }

   return (
      <>
         {getHeadingTextSplit().first}
         <span>{text}</span>
         <span className='caret'></span> <br /> {getHeadingTextSplit().second}
      </>
   );
};

const TypeWrapper: React.FC<{
   markets: string[];
   heading: string;
}> = ({ markets = DUMMY_MARKETS, heading }) => {
   const { locale } = useLocale();

   return !locale || locale == 'en' ? (
      <TypewriterText markets={markets} heading={heading} />
   ) : locale === 'ru' ? (
      <>
         Разблокировать <br /> <span>Отраслевые обзоры</span> с помощью
         комплексного исследования
      </>
   ) : locale === 'ar' ? (
      <>
         افتح <br /> <span>رؤى الصناعة</span> مع بحث شامل
      </>
   ) : locale === 'de' ? (
      <>
         Entsperren <br /> <span>Branchen-Einblicke</span> mit umfassender
         Recherche
      </>
   ) : locale === 'fr' ? (
      <>
         Débloquer <br /> <span>Aperçus du secteur</span> grâce à une recherche
         exhaustive
      </>
   ) : locale === 'zh-Hant-TW' ? (
      <>
         解鎖 <br /> <span>產業洞察</span> 透過全面研究
      </>
   ) : locale === 'ja' ? (
      <>
         アンロック <br /> <span>業界の洞察</span> 包括的な調査で
      </>
   ) : locale === 'ko' ? (
      <>
         잠금 해제 <br /> <span>산업 통찰력</span> 종합적인 연구와 함께
      </>
   ) : locale === 'vi' ? (
      <>
         Mở khóa <br /> <span>Thông tin chi tiết về ngành</span> với nghiên cứu
         toàn diện
      </>
   ) : locale === 'it' ? (
      <>
         Sblocca <br /> <span>Approfondimenti di settore</span> con una ricerca
         completa
      </>
   ) : locale === 'pl' ? (
      <>
         Odblokuj <br /> <span>Wnioski z branży</span> dzięki kompleksowym
         badaniom
      </>
   ) : locale === 'zh-CN' ? (
      <>
         解锁 <br /> <span>行业洞察</span> 通过全面研究
      </>
   ) : locale === 'es' ? (
      <>
         Desbloquear <br /> <span>Información del sector</span> con una
         investigación exhaustiva
      </>
   ) : (
      <>
         Unlock <br /> <span>Industry Insights</span> with Comprehensive
         research
      </>
   );
};

export default TypeWrapper;
