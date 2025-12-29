import { TimeRange } from '../types';

export function isOverlap(a: TimeRange, b: TimeRange) {
  return a.start < b.end && b.start < a.end;
}
