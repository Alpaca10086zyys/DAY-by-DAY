import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppConfigProvider } from '@/config/useAppConfig';
import { ConfigAndI18nProvider } from '@/config/ConfigAndI18nProvider';
import { Slot } from 'expo-router';
import '@/i18n';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppConfigProvider>
        <ConfigAndI18nProvider>
          <Slot />
        </ConfigAndI18nProvider>
      </AppConfigProvider>
    </SafeAreaProvider>
  );
}
