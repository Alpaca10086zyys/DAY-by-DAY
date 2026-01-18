import * as Notifications from 'expo-notifications';
import { AgendaEvent } from '@/agenda/types';
import { loadEvents, saveEvents } from '@/agenda/storage/eventStore';

// iOS 前台也显示通知
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 1️⃣ 初始化权限
export async function initNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// 2️⃣ 创建通知
export async function scheduleEventNotification(event: AgendaEvent) {
  if (!event.remindAt) return null;

  return await Notifications.scheduleNotificationAsync({
    content: {
      title: event.title,
      body: '日程即将开始',
      sound: true,
    },
    trigger: new Date(event.remindAt),
  });
}

// 3️⃣ 取消通知
export async function cancelEventNotification(notificationId?: string) {
  if (!notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

// 4️⃣ 🔥 恢复 & 对账通知（你缺的就是这个）
export async function restoreScheduledNotifications() {
  const { events } = await loadEvents();

  for (const event of events) {
    // 已过期的提醒，不再恢复
    if (!event.remindAt || event.remindAt < Date.now()) continue;

    // 已经有 notificationId，认为正常
    if (event.notificationId) continue;

    // 补建通知
    const id = await scheduleEventNotification(event);
    event.notificationId = id ?? undefined;
  }

  await saveEvents(events);
}
