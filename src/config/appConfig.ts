//src/config/appConfig.ts
import { Language } from '@/i18n/types';
import { THEMES } from '@/theme/themes';


export interface AppConfig {
  language: Language;
  weekStartsOn: 0 | 1;
  theme: ThemeKey;
}

export type ThemeKey = keyof typeof THEMES;

export const DEFAULT_CONFIG: AppConfig = {
  language: 'zh',
  weekStartsOn: 0,
  theme: 'blue',
};

export const CONFIG_STORAGE_KEY = 'APP_CONFIG';
