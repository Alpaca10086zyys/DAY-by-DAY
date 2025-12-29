export function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function combineDateAndMinutes(date: Date, minutes: number) {
  const d = new Date(date);
  d.setHours(0, minutes, 0, 0);
  return d.getTime();
}
