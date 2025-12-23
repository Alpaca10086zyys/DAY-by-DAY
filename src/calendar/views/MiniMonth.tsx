// src/calendar/views/MiniMonth.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalendarEngine } from '@/calendar/utils/calendarEngine';

interface Props {
  month: Date;
  engine: CalendarEngine;
}

export default function MiniMonth({ month, engine }: Props) {
  const days = engine.getMonthGridByDate(month);
  const currentMonth = month.getMonth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{month.getMonth() + 1}月</Text>

      <View style={styles.grid}>
        {days.map((day) => {
          const isCurrent = day.getMonth() === currentMonth;
          return (
            <Text key={day.toISOString()} style={[styles.day, !isCurrent && styles.outside]}>
              {day.getDate()}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.28%',
    lineHeight: 16,
    textAlign: 'center',
    fontSize: 8,
    fontWeight: '600',
    color: '#111',
  },
  outside: {
    color: '#bbb',
  },
});
