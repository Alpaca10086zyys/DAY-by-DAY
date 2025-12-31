//src/app/_layout.tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppConfigProvider } from '@/config/useAppConfig';
import { ConfigAndI18nProvider } from '@/config/ConfigAndI18nProvider';
import { Slot } from 'expo-router';
import { EventModal } from '@/components/agenda/EventModal';
import { CreateEventProvider } from '@/agenda/hooks/useCreateEventModal';
import '@/i18n';
import 'react-native-get-random-values'; 
import { useAgenda } from '@/agenda/hooks/useAgenda';
import { GestureHandlerRootView } from 'react-native-gesture-handler';



export default function RootLayout() {
  const { upsertEvent } = useAgenda();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppConfigProvider>
          <ConfigAndI18nProvider>
            <CreateEventProvider>
              <Slot />
              <EventModal
                onSave={(event) => {
                  upsertEvent(event);
                }}
              />
            </CreateEventProvider>
          </ConfigAndI18nProvider>
        </AppConfigProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
