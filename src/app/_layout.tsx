//src/app/_layout.tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppConfigProvider } from '@/config/useAppConfig';
import { ConfigAndI18nProvider } from '@/config/ConfigAndI18nProvider';
import { Slot } from 'expo-router';
import { EventModal } from '@/components/agenda/EventModal';
import { CreateEventProvider } from '@/agenda/hooks/useCreateEventModal';
import { AgendaProvider, useAgenda } from '@/agenda/hooks/AgendaProvider';
import '@/i18n';
import 'react-native-get-random-values';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  initNotificationPermission,
  restoreScheduledNotifications,
} from '@/services/notification';
import { useEffect } from 'react';

// 内部组件：需要使用 useAgenda 的组件
function AppContent() {
  const { upsertEvent, reloadEvents } = useAgenda();

  useEffect(() => {
    initNotificationPermission();
    restoreScheduledNotifications(reloadEvents);
  }, [reloadEvents]);

  return (
    <>
      <Slot />
      <EventModal
        onSave={(event) => {
          console.log('保存 event:', event);
          upsertEvent(event);
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppConfigProvider>
          <ConfigAndI18nProvider>
            <AgendaProvider>
              <CreateEventProvider>
                <AppContent />
              </CreateEventProvider>
            </AgendaProvider>
          </ConfigAndI18nProvider>
        </AppConfigProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
