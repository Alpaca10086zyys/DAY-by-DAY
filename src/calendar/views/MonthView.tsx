// src/calendar/views/MonthView.tsx
import React, { useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { addMonths } from 'date-fns';
import { CalendarEngine } from '@/calendar/utils/calendarEngine';
import { getConfig, WEEK_DAY_NAMES } from '@/calendar/utils/configManager';

interface MonthViewProps {
  engine: CalendarEngine;
}

const CELL_HEIGHT = 56;
const ROWS = 6;
const WEEK_HEADER_HEIGHT = 32;

const MONTH_HEIGHT = WEEK_HEADER_HEIGHT + CELL_HEIGHT * ROWS;

function MonthGrid({ date, engine }: { date: Date; engine: CalendarEngine }) {
  const today = new Date();
  const config = getConfig();

  engine.setDate(date);
  const days = engine.getMonthGrid();
  const currentMonth = date.getMonth();

  return (
    <View style={styles.grid}>
      {days.map((day) => {
        const isCurrentMonth = day.getMonth() === currentMonth;
        const isToday = day.toDateString() === today.toDateString();

        return (
          <View
            key={day.toISOString()}
            style={[
              styles.cell,
              !isCurrentMonth && styles.notCurrentMonth,
              isToday && styles.todayCell,
            ]}
          >
            <Text
              style={[
                styles.cellText,
                !isCurrentMonth && styles.notCurrentMonthText,
                isToday && { color: config.themeColor, fontWeight: '600' },
              ]}
            >
              {day.getDate()}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function MonthPage({ date }: { date: Date }) {
  const engine = new CalendarEngine(date);
  const days = engine.getMonthGrid();
  const today = new Date();
  const currentMonth = date.getMonth();
  const config = getConfig();

  return (
    <View style={{ height: MONTH_HEIGHT }}>
      <View style={styles.grid}>
        {days.map((day) => {
          const isCurrentMonth = day.getMonth() === currentMonth;
          const isToday = day.toDateString() === today.toDateString();

          return (
            <View
              key={day.toISOString()}
              style={[
                styles.cell,
                !isCurrentMonth && styles.notCurrentMonth,
                isToday && styles.todayCell,
              ]}
            >
              <Text
                style={[
                  styles.cellText,
                  !isCurrentMonth && styles.notCurrentMonthText,
                  isToday && { color: config.themeColor, fontWeight: '600' },
                ]}
              >
                {day.getDate()}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function MonthView({ engine }: MonthViewProps) {
  const config = getConfig();
  const weekDays = WEEK_DAY_NAMES[config.language];

  const orderedWeekDays = [
    ...weekDays.slice(engine.config.weekStartsOn),
    ...weekDays.slice(0, engine.config.weekStartsOn),
  ];

  /** 构造月份序列（以当前月为中心） */
  const months = Array.from({ length: 25 }, (_, i) => addMonths(engine.getDate(), i - 12));

  const onScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / MONTH_HEIGHT);
    engine.setDate(months[index]); // ✅ 只在这里改 engine
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 星期标题 */}
      <View style={styles.weekHeader}>
        {orderedWeekDays.map((day, i) => (
          <Text key={i} style={[styles.weekText, { color: config.themeColor }]}>
            {day}
          </Text>
        ))}
      </View>

      <FlatList
        data={months}
        renderItem={({ item }) => <MonthPage date={item} />}
        keyExtractor={(item) => item.toISOString()}
        snapToInterval={MONTH_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        initialScrollIndex={12}
        getItemLayout={(_, index) => ({
          length: MONTH_HEIGHT,
          offset: MONTH_HEIGHT * index,
          index,
        })}
        onMomentumScrollEnd={onScrollEnd}
        windowSize={3}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  weekHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  weekText: {
    width: '14.28%',
    textAlign: 'center',
    paddingVertical: 6,
    fontSize: 12,
  },
  monthContainer: {
    height: MONTH_HEIGHT,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '14.28%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#eee',
  },
  cellText: {
    fontSize: 16,
    color: '#111',
  },
  notCurrentMonth: {
    backgroundColor: '#fafafa',
  },
  notCurrentMonthText: {
    color: '#bbb',
  },
  todayCell: {
    backgroundColor: '#007AFF22',
  },
});
