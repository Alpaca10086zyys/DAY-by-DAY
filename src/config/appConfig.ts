//src/config/appConfig.ts
import { Language } from '@/i18n/types';

export interface AppConfig {
  language: Language;
  weekStartsOn: 0 | 1;
  theme: ThemeKey;
}

export const THEMES = {
  blue: '#007AFF',
  green: '#34C759',
  orange: '#FF9500',
  pink: '#FF3B30',
  purple: '#AF52DE',
} as const;

export type ThemeKey = keyof typeof THEMES;

export const DEFAULT_CONFIG: AppConfig = {
  language: 'zh',
  weekStartsOn: 0,
  theme: 'blue',
};

export const CONFIG_STORAGE_KEY = 'APP_CONFIG';
