// src/config/ConfigAndI18nProvider.tsx
import { createContext, useContext, useEffect } from 'react';
import { useAppConfig } from './useAppConfig';
import i18n from '@/i18n';
import { Language } from '@/i18n/types';

interface ContextType {
  language: Language;
  changeLanguage: (lang: Language) => Promise<void>;
}

const Context = createContext<ContextType | null>(null);

export function ConfigAndI18nProvider({ children }: { children: React.ReactNode }) {
  const { config, updateConfig } = useAppConfig();

  // config → i18n
  useEffect(() => {
    if (config.language !== i18n.language) {
      i18n.changeLanguage(config.language);
    }
  }, [config.language]);

  const changeLanguage = async (lang: Language) => {
    await updateConfig({ language: lang });
  };

  return (
    <Context.Provider value={{ language: config.language, changeLanguage }}>
      {children}
    </Context.Provider>
  );
}

export function useConfigAndI18n() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useConfigAndI18n must be used within provider');
  return ctx;
}
