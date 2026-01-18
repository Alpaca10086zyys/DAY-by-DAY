// src/agenda/hooks/useAgenda.ts
import { useEffect, useState, useMemo } from 'react';
import { AgendaEvent } from '../types';
import { loadEvents, saveEvents } from '../storage/eventStore';
import { format, eachDayOfInterval } from 'date-fns';
import { scheduleEventNotification, cancelEventNotification } from '@/services/notification';

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
      const exists = prev.find(e => e.id === event.id);

      // 如果之前有通知，先取消
      if (exists?.notificationId) {
        cancelEventNotification(exists.notificationId);
      }

      // 重新创建
      let nextEvent = { ...event };
      if (event.remindAt) {
        scheduleEventNotification(event).then(id => {
          nextEvent.notificationId = id ?? undefined;
          saveEvents([...prev.filter(e => e.id !== event.id), nextEvent]);
        });
      }

      const next = exists
        ? prev.map(e => (e.id === event.id ? nextEvent : e))
        : [...prev, nextEvent];

      saveEvents(next);
      return next;
    });
  };

  const removeEvent = async (id: string) => {
    setEvents(prev => {
      const target = prev.find(e => e.id === id);
      if (target?.notificationId) {
        cancelEventNotification(target.notificationId);
      }
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
