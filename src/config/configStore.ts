//src/config/configStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig, DEFAULT_CONFIG, CONFIG_STORAGE_KEY } from './appConfig';

export async function loadConfig(): Promise<AppConfig> {
  try {
    const raw = await AsyncStorage.getItem(CONFIG_STORAGE_KEY);
    return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function saveConfig(patch: Partial<AppConfig>): Promise<AppConfig> {
  try{
    const current = await loadConfig();
    const next = { ...current, ...patch };
    await AsyncStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch (error) {
    console.error('Failed to save config:', error);
    throw error;
  }
}


export async function clearConfig(): Promise<void> {
    try {
        await AsyncStorage.removeItem(CONFIG_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear config:', error);
      throw error;
    }
}