//src/app/_layout.tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppConfigProvider } from '@/config/useAppConfig';
import { ConfigAndI18nProvider } from '@/config/ConfigAndI18nProvider';
import { Slot } from 'expo-router';
import { EventModal } from '@/components/agenda/EventModal';
import { CreateEventProvider } from '@/agenda/hooks/useCreateEventModal';
import '@/i18n';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppConfigProvider>
        <ConfigAndI18nProvider>
          <CreateEventProvider>
            <Slot />
            <EventModal onSave={() => {}} />
          </CreateEventProvider>
        </ConfigAndI18nProvider>
      </AppConfigProvider>
    </SafeAreaProvider>
  );
}
