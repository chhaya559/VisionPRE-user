import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enCommon from './locales/en/common.json';
import enProfile from './locales/en/profile.json';

import frCommon from './locales/fr/common.json';
import frProfile from './locales/fr/profile.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        profile: enProfile,
      },
      fr: {
        common: frCommon,
        profile: frProfile,
      },
    },

    fallbackLng: 'en',
    ns: ['common', 'profile'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['navigator', 'localStorage'],
      caches: ['localStorage'],
    },
  });

export default i18n;
