// src/theme/useTheme.ts
import { useAppConfig } from '@/config/useAppConfig';
import { THEMES, Theme } from '@/theme/themes';

export function useTheme(): Theme {
  const { config } = useAppConfig();

  return THEMES[config.theme];
}
