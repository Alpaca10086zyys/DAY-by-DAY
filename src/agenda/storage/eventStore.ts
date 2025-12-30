// src/agenda/storage/eventStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AgendaEvent } from '@/agenda/types';

const KEY = 'AGENDA_EVENTS';

export async function loadEvents(): Promise<{ success: boolean; events: AgendaEvent[] }> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const events = raw ? JSON.parse(raw) : [];
    return { success: true, events };
  } catch (e) {
    console.error('读取事件失败', e);
    return { success: false, events: [] };
  }
}

export async function saveEvents(events: AgendaEvent[]): Promise<boolean> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(events));
    return true; // 保存成功
  } catch (e) {
    console.error('保存事件失败', e);
    return false; // 保存失败
  }
}
