// src/theme/useTheme.ts
import { useAppConfig } from '@/config/useAppConfig';
import { THEMES } from '@/config/appConfig';

export function useTheme() {
  const { config } = useAppConfig();

  const themeColor = THEMES[config.themeColor];

  return {
    themeColor,
  };
}
