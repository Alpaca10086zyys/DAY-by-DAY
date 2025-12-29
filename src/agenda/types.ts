//src/agenda/types.ts
export type EventID = string;
export type ThemeKey = 'blue' | 'green' | 'orange';

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
