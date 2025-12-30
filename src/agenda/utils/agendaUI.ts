// utils/agendaUI.ts
import { format } from 'date-fns';

export function formatTimeRange(startAt: number, endAt: number) {
  return `${format(startAt, 'HH:mm')} - ${format(endAt, 'HH:mm')}`;
}

export function getSoftColor(color: string) {
  const map: Record<string, string> = {
    blue: 'rgba(0,122,255,0.12)',
    green: 'rgba(52,199,89,0.12)',
    orange: 'rgba(255,149,0,0.12)',
  };
  return map[color] ?? 'rgba(0,0,0,0.05)';
}
