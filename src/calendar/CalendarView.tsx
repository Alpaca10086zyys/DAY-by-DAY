export function CalendarView({ viewMode, date }) {
  switch (viewMode) {
    case 'month':
      return <MonthView date={date} />;
    case 'week':
      return <WeekView date={date} />;
    case 'day':
      return <DayView date={date} />;
    case 'year':
      return <YearView date={date} />;
  }
}
