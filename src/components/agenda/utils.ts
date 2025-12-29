// src/agenda/components/utils.ts
export function mergeDateTime(
  base: Date,
  picked: Date,
  mode: 'date' | 'time'
) {
  const next = new Date(base);

  if (mode === 'date') {
    next.setFullYear(
      picked.getFullYear(),
      picked.getMonth(),
      picked.getDate()
    );
  } else {
    next.setHours(
      picked.getHours(),
      picked.getMinutes(),
      0,
      0
    );
  }

  return next;
}
