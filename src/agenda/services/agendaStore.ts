import AsyncStorage from '@react-native-async-storage/async-storage';
import { AgendaEvent } from '../types';

const STORAGE_KEY = 'AGENDA_EVENTS';

export async function loadEvents(): Promise<AgendaEvent[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveEvents(events: AgendaEvent[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}
