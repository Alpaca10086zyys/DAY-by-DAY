import { AgendaEvent, TimeRange } from '../types';
import { isOverlap } from '../utils/overlap';

export function useConflictCheck(events: AgendaEvent[]) {
  function hasConflict(date: string, range: TimeRange, excludeId?: string) {
    return events.some(e => {
      if (e.date !== date) return false;
      if (excludeId && e.id === excludeId) return false;
      return isOverlap(e.time, range);
    });
  }

  return { hasConflict };
}
