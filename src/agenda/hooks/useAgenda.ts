// src/agenda/hooks/useAgenda.ts
import { useEffect, useState, useMemo } from 'react';
import { AgendaEvent } from '../types';
import { loadEvents, saveEvents } from '../storage/eventStore';
import { format, eachDayOfInterval } from 'date-fns';

export function useAgenda() {
  const [events, setEvents] = useState<AgendaEvent[]>([]);

  useEffect(() => {
    reloadEvents();
  }, []);

  const reloadEvents = async () => {
    const data = await loadEvents();
    if (Array.isArray(data.events)) {
      setEvents(data.events);
      console.log('reloadEvents', data.events);
    } else {
      setEvents([]);
    }
  };

  const upsertEvent = async (event: AgendaEvent) => {
    setEvents(prev => {
      const exists = prev.some(e => e.id === event.id);
      const next = exists
        ? prev.map(e => (e.id === event.id ? event : e))
        : [...prev, event];

      saveEvents(next);
      console.log('插入Event', event, exists);
      return next;
    });
  };

  const removeEvent = async (id: string) => {
    setEvents(prev => {
      const next = prev.filter(e => e.id !== id);
      saveEvents(next);
      return next;
    });
  };

   // 🔹 按时间排序的 Agenda Tab 数据
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => a.startAt - b.startAt);
  }, [events]);

  // 🔹 动态生成按日分组的索引
  const eventsByDay = useMemo(() => {
    const map: Record<string, AgendaEvent[]> = {};

    events.forEach(event => {
      const days = eachDayOfInterval({
        start: new Date(event.startAt),
        end: new Date(event.endAt),
      });

      days.forEach(day => {
        const key = format(day, 'yyyy-MM-dd');
        if (!map[key]) map[key] = [];
        map[key].push(event);
      });
    });

    // 每天的事件按开始时间排序
    Object.keys(map).forEach(key => {
      map[key].sort((a, b) => a.startAt - b.startAt);
    });

    return map;
  }, [events]);

  return {
    events,
    upsertEvent,
    removeEvent,
    sortedEvents, //agenda tab
    eventsByDay, // calendar tab
    reloadEvents,
  };
}
