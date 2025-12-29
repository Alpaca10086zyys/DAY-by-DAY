//src/agenda/models/event.ts
import { v4 as uuidv4 } from 'uuid';
import { AgendaEvent } from '../types';

export function createEvent(
  partial: Omit<AgendaEvent, 'id' | 'createdAt' | 'updatedAt'>
): AgendaEvent {
  const now = Date.now();

  return {
    ...partial,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
}

