import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ru from './locales/ru.json';
import uz from './locales/uz.json';
import kk from './locales/kk.json';
import ky from './locales/ky.json';
import tg from './locales/tg.json';
import zh from './locales/zh.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      uz: { translation: uz },
      kk: { translation: kk },
      ky: { translation: ky },
      tg: { translation: tg },
      zh: { translation: zh }
    },

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;