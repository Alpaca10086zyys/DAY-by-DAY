//src/agenda/types.ts
export type EventID = string;
import type { ThemeKey } from '@/theme/themes';

export interface AgendaEvent {
  id: EventID;
  title: string;
  description?: string;

  startAt: number; // timestamp (ms)
  endAt: number;   // timestamp (ms)

  color: ThemeKey;
  createdAt: number;
  updatedAt?: number;

  // 🔔 Notification 扩展
  remindAt?: number;        // 实际触发提醒时间（ms）
  notificationId?: string; // expo-notifications 返回的ID
}
