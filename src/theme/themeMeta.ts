// src/theme/themeMeta.ts
import { ThemeKey } from './themes';

export const THEME_META: Record<
  ThemeKey,
  {
    labelKey: string;
  }
> = {
  blue: {
    labelKey: 'theme.blue',
  },
  green: {
    labelKey: 'theme.green',
  },
  orange: {
    labelKey: 'theme.orange',
  },
  purple: {
    labelKey: 'theme.purple',
  },
};
