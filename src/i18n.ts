import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enCommon from './locales/en/common.json';
import enPrivate from './locales/en/private.json';
import enProfile from './locales/en/profile.json';
import enTerms from './locales/en/terms.json';
import enSettings from "./locales/en/Setting.json";
import enNotifications from "./locales/en/Notifications.json";
import frCommon from './locales/fr/common.json';
import frPrivate from './locales/fr/private.json';
import frProfile from './locales/fr/profile.json';
import frTerms from './locales/fr/terms.json';
import frSettings from "./locales/fr/Setting.json";
import frNotifications from "./locales/fr/Notifications.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        private: enPrivate,
        profile: enProfile,
        terms: enTerms,
        settings: enSettings,
        notifications: enNotifications
      },
      fr: {
        common: frCommon,
        private: frPrivate,
        profile: frProfile,
        terms: frTerms,
        settings: frSettings,
        notifications: frNotifications
      },
    },

    fallbackLng: 'en',
    ns: ['common', 'private', 'profile', 'terms', 'settings', 'notifications'],
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
