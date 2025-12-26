export const THEMES = {
  blue: {
    primary: '#007AFF',
    primarySoft: '#007AFF22',
    textPrimary: '#111111',
    textSecondary: '#666666',
    border: '#E5E5E5',
    background: '#FFFFFF',
  },

  green: {
    primary: '#34C759',
    primarySoft: '#34C75922',
    textPrimary: '#111111',
    textSecondary: '#666666',
    border: '#E5E5E5',
    background: '#FFFFFF',
  },

  orange: {
    primary: '#FF9500',
    primarySoft: '#FF950022',
    textPrimary: '#111111',
    textSecondary: '#666666',
    border: '#E5E5E5',
    background: '#FFFFFF',
  },

  purple: {
    primary: '#AF52DE',
    primarySoft: '#AF52DE22',
    textPrimary: '#111111',
    textSecondary: '#666666',
    border: '#E5E5E5',
    background: '#FFFFFF',
  },
} as const;

export type ThemeKey = keyof typeof THEMES;
export type Theme = typeof THEMES[ThemeKey];
