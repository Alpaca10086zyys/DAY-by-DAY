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
}
