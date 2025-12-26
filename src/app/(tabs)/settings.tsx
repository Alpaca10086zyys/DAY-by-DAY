//src/app/(tabs)/settings.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useConfigAndI18n } from '@/config/ConfigAndI18nProvider';
import { THEMES, ThemeKey } from '@/config/appConfig';
import { useAppConfig } from '@/config/useAppConfig';
import { CapsuleSegmented } from '@/components/base/CapsuleSegmented';
import { ColorSelector } from '@/components/base/ColorSelector';
import { SafeAreaView } from 'react-native-safe-area-context';

const THEME_COLORS = [
  '#007AFF', // iOS 蓝
  '#34C759', // 绿
  '#FF9500', // 橙
  '#FF3B30', // 红
  '#AF52DE', // 紫
];

export default function Settings() {
  const { t } = useTranslation();
  const { language, changeLanguage } = useConfigAndI18n();
  const { config, updateConfig } = useAppConfig();

  return (
     <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Text style={styles.title}>{t('settings.title')}</Text>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          <CapsuleSegmented
            options={[
              { label: '中文', value: 'zh' },
              { label: 'English', value: 'en' },
              { label: '日本語', value: 'ja' },
            ]}
            value={language}
            onChange={changeLanguage}
          /> 
        </View>
        {/* 增加主题配置 */}
        {/* 增加一周从哪天开始的配置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.theme')}
          </Text>
          <ColorSelector
            value={config.themeColor}
            options={Object.keys(THEMES) as ThemeKey[]}
            onChange={(theme) => updateConfig({ themeColor: theme })}
          />
        </View>
      </View>
      
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    lineHeight: 36,
    fontWeight: '500',
    margin: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  container: {
    flex: 1,
    // alignItems: 'center',
    padding: 16,
    gap:16,
    // justifyContent: 'center',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
});
