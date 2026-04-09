import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enCommon from './locales/en/common.json';
import enPrivate from './locales/en/private.json';
import enProfile from './locales/en/profile.json';
import enTerms from './locales/en/terms.json';
import enSettings from './locales/en/Setting.json';
import enNotifications from './locales/en/Notifications.json';
import enErrors from './locales/en/Errors.json';
import arCommon from './locales/ar/common.json';
import arPrivate from './locales/ar/private.json';
import arProfile from './locales/ar/profile.json';
import arTerms from './locales/ar/terms.json';
import arNotifications from './locales/ar/Notifications.json';
import arSettings from './locales/ar/Setting.json';
import arErrors from './locales/ar/Errors.json';
import deCommon from './locales/de/common.json';
import dePrivate from './locales/de/private.json';
import deProfile from './locales/de/profile.json';
import deTerms from './locales/de/terms.json';
import deNotifications from './locales/de/Notifications.json';
import deSettings from './locales/de/Setting.json';
import deErrors from './locales/de/Errors.json';
import frCommon from './locales/fr/common.json';
import frPrivate from './locales/fr/private.json';
import frProfile from './locales/fr/profile.json';
import frTerms from './locales/fr/terms.json';
import frSettings from './locales/fr/Setting.json';
import frNotifications from './locales/fr/Notifications.json';
import frErrors from './locales/fr/Errors.json';
import esCommon from './locales/es/common.json';
import esPrivate from './locales/es/private.json';
import esProfile from './locales/es/profile.json';
import esTerms from './locales/es/terms.json';
import esSettings from './locales/es/Setting.json';
import esNotifications from './locales/es/Notifications.json';
import esErrors from './locales/es/Errors.json';
import itCommon from './locales/it/common.json';
import itPrivate from './locales/it/private.json';
import itProfile from './locales/it/profile.json';
import itTerms from './locales/it/terms.json';
import itSettings from './locales/it/Setting.json';
import itNotifications from './locales/it/Notifications.json';
import itErrors from './locales/it/Errors.json';
import jaCommon from './locales/ja/common.json';
import jaPrivate from './locales/ja/private.json';
import jaProfile from './locales/ja/profile.json';
import jaTerms from './locales/ja/terms.json';
import jaSettings from './locales/ja/Setting.json';
import jaNotifications from './locales/ja/Notifications.json';
import jaErrors from './locales/ja/Errors.json';
import ptCommon from './locales/pt/common.json';
import ptPrivate from './locales/pt/private.json';
import ptProfile from './locales/pt/profile.json';
import ptTerms from './locales/pt/terms.json';
import ptSettings from './locales/pt/Setting.json';
import ptNotifications from './locales/pt/Notifications.json';
import ptErrors from './locales/pt/Errors.json';
import zhCommon from './locales/zh/common.json';
import zhPrivate from './locales/zh/private.json';
import zhProfile from './locales/zh/profile.json';
import zhTerms from './locales/zh/terms.json';
import zhSettings from './locales/zh/Setting.json';
import zhNotifications from './locales/zh/Notifications.json';
import zhErrors from './locales/zh/Errors.json';

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
        notifications: enNotifications,
        errors: enErrors,
      },
      ar: {
        common: arCommon,
        private: arPrivate,
        profile: arProfile,
        terms: arTerms,
        settings: arSettings,
        notifications: arNotifications,
        errors: arErrors,
      },
      fr: {
        common: frCommon,
        private: frPrivate,
        profile: frProfile,
        terms: frTerms,
        settings: frSettings,
        notifications: frNotifications,
        errors: frErrors,
      },
      de: {
        common: deCommon,
        private: dePrivate,
        profile: deProfile,
        terms: deTerms,
        settings: deSettings,
        notifications: deNotifications,
        errors: deErrors,
      },
      es: {
        common: esCommon,
        private: esPrivate,
        profile: esProfile,
        terms: esTerms,
        settings: esSettings,
        notifications: esNotifications,
        errors: esErrors,
      },
      it: {
        common: itCommon,
        private: itPrivate,
        profile: itProfile,
        terms: itTerms,
        settings: itSettings,
        notifications: itNotifications,
        errors: itErrors,
      },
      ja: {
        common: jaCommon,
        private: jaPrivate,
        profile: jaProfile,
        terms: jaTerms,
        settings: jaSettings,
        notifications: jaNotifications,
        errors: jaErrors,
      },
      pt: {
        common: ptCommon,
        private: ptPrivate,
        profile: ptProfile,
        terms: ptTerms,
        settings: ptSettings,
        notifications: ptNotifications,
        errors: ptErrors,
      },
      zh: {
        common: zhCommon,
        private: zhPrivate,
        profile: zhProfile,
        terms: zhTerms,
        settings: zhSettings,
        notifications: zhNotifications,
        errors: zhErrors,
      },
    },

    fallbackLng: 'en',
    ns: [
      'common',
      'private',
      'profile',
      'terms',
      'settings',
      'notifications',
      'errors',
    ],
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
