// Handles translation and internationalization using i18next and react-i18next. It initializes the i18n instance with the available languages and their respective translation files, sets the default language based on local storage or defaults to English, and configures interpolation settings.
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import fi from '../locales/fi.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fi: { translation: fi }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;