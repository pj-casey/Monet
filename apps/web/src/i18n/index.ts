/**
 * i18n setup — internationalization with react-i18next.
 *
 * Supports English (default), Spanish, and French.
 * Language is stored in localStorage and auto-detected from browser.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';

const savedLang = localStorage.getItem('monet-lang');

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
  },
  lng: savedLang || undefined,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  detection: {
    order: ['localStorage', 'navigator'],
    lookupLocalStorage: 'monet-lang',
  },
});

export default i18n;
