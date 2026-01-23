// src/calendar/views/MiniMonth.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalendarEngine } from '@/calendar/utils/calendarEngine';
import { format } from 'date-fns';
import { useAgenda } from '@/agenda/hooks/AgendaProvider';
import { useTheme } from '@/theme/useTheme';

interface Props {
  month: Date;
  engine: CalendarEngine;
}

export default function MiniMonth({ month, engine }: Props) {
  const days = engine.getMonthGridByDate(month);
  const currentMonth = month.getMonth();
  const { eventsByDay } = useAgenda();
  const theme = useTheme();

  // 检查某天是否有事件
  const hasEvent = (day: Date) => {
    const key = format(day, 'yyyy-MM-dd');
    const events = eventsByDay[key];
    return events && events.length > 0;
  };

  // 获取某天的事件数量（最多显示3个点）
  const getEventCount = (day: Date) => {
    const key = format(day, 'yyyy-MM-dd');
    const events = eventsByDay[key];
    return events ? Math.min(events.length, 3) : 0;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{month.getMonth() + 1}月</Text>

      <View style={styles.grid}>
        {days.map((day) => {
          const isCurrent = day.getMonth() === currentMonth;
          const eventCount = hasEvent(day) ? getEventCount(day) : 0;
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <View key={day.toISOString()} style={styles.dayContainer}>
              <Text
                style={[
                  styles.day,
                  !isCurrent && styles.outside,
                  isToday && styles.today
                ]}
              >
                {day.getDate()}
              </Text>
              {/* 事件标记点 */}
              {eventCount > 0 && (
                <View style={styles.eventDots}>
                  {Array.from({ length: eventCount }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.eventDot,
                        { backgroundColor: theme.primary }
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 2,
    color: '#111',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayContainer: {
    width: '14.28%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 16,
    position: 'relative',
  },
  day: {
    lineHeight: 14,
    textAlign: 'center',
    fontSize: 8,
    fontWeight: '600',
    color: '#111',
  },
  outside: {
    color: '#bbb',
  },
  today: {
    color: '#007AFF',
    fontWeight: '700',
  },
  eventDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1.5,
    marginTop: 1,
  },
  eventDot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
  },
});
