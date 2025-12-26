// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zh from './locales/zh';
import en from './locales/en';
import ja from './locales/ja';

export const resources = {
  zh: { translation: zh },
  en: { translation: en },
  ja: { translation: ja },
} as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
