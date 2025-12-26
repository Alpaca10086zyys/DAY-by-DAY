//src/config/useAppConfig.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AppConfig, DEFAULT_CONFIG } from './appConfig';
import { loadConfig, saveConfig } from './configStore';

const AppConfigContext = createContext<{
  config: AppConfig;
  updateConfig: (patch: Partial<AppConfig>) => void;
  loading: boolean;
} | null>(null);

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialConfig = async () => {
      try {
        const loadedConfig = await loadConfig();
        setConfig(loadedConfig);
      } catch (error) {
        console.error('Failed to load config:', error);
        setConfig(DEFAULT_CONFIG);
      } finally {
        setLoading(false);
      }
    };
    loadInitialConfig();
  }, []);

  const updateConfig = useCallback(async (patch: Partial<AppConfig>) => {
    try {
      const updatedConfig = await saveConfig(patch);
      setConfig(updatedConfig);
    } catch (error) {
      console.error('Failed to update config:', error);
      throw error;
    }
  }, []);

  return (
    <AppConfigContext.Provider value={{ config, updateConfig, loading }}>
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfig() {
  const ctx = useContext(AppConfigContext);
  if (!ctx) throw new Error('useAppConfig must be used within AppConfigProvider');
  return ctx;
}
