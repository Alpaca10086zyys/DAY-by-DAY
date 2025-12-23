// src/calendar/utils/configManager.ts
export interface CalendarConfig {
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=周日, 1=周一, ..., 6=周六
  language: 'zh' | 'en' | 'ja' | 'ko'; // 支持的语言
  themeColor: string; // 主题色
}

// 默认配置
export const DEFAULT_CONFIG: CalendarConfig = {
  weekStartsOn: 1, // 默认周一为一周开始
  language: 'zh', // 默认中文
  themeColor: '#007AFF', // 默认蓝色主题
};

// 本地存储键名
const CONFIG_STORAGE_KEY = 'calendar_config';

// 获取配置
export function getConfig(): CalendarConfig {
  try {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    return stored ? { ...DEFAULT_CONFIG, ...JSON.parse(stored) } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

// 保存配置
export function saveConfig(config: Partial<CalendarConfig>): void {
  try {
    const current = getConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save config:', error);
  }
}

// 语言映射
export const WEEK_DAY_NAMES: Record<string, string[]> = {
  zh: ['日', '一', '二', '三', '四', '五', '六'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  ja: ['日', '月', '火', '水', '木', '金', '土'],
  ko: ['일', '월', '화', '수', '목', '금', '토'],
};
