import { useState } from 'react';
import { TimeRange, ThemeKey } from '../types';

export function useEventForm(initialDate: Date) {
  const [title, setTitle] = useState('');
  const [range, setRange] = useState<TimeRange | null>(null);
  const [color, setColor] = useState<ThemeKey>('blue');

  return {
    title,
    setTitle,
    range,
    setRange,
    color,
    setColor,
  };
}
