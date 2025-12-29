//src/agenda/hooks/useAgenda.ts
import { useEffect, useState } from 'react';
import { AgendaEvent } from '../types';
import { loadEvents, saveEvents } from '../services/agendaStore';

export function useAgenda() {
  const [events, setEvents] = useState<AgendaEvent[]>([]);

  useEffect(() => {
    loadEvents().then(setEvents);
  }, []);

  async function addEvent(event: AgendaEvent) {
    const next = [...events, event];
    setEvents(next);
    await saveEvents(next);
  }

  async function updateEvent(updated: AgendaEvent) {
    const next = events.map(e => (e.id === updated.id ? updated : e));
    setEvents(next);
    await saveEvents(next);
  }

  return {
    events,
    addEvent,
    updateEvent,
  };
}
