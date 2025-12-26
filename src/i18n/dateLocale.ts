// src/i18n/dateLocale.ts
import type { Locale } from 'date-fns';
import { zhCN, enUS, ja } from 'date-fns/locale';
import { Language } from './types';

export const dateLocales: Record<Language, Locale> = {
  'zh': zhCN,
  'en': enUS,
  'ja': ja,
};
