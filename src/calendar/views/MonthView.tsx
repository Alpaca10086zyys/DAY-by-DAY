// src/calendar/views/MonthView.tsx
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { addMonths, format } from 'date-fns';
import { CalendarEngine } from '@/calendar/utils/calendarEngine';
import { getConfig, WEEK_DAY_NAMES } from '@/calendar/utils/configManager';

interface MonthViewProps {
  engine: CalendarEngine;
  onSelectDay?: () => void;
  onMonthChange?: (date: Date) => void; // 新增回调
}

const CELL_HEIGHT = 56;
const ROWS = 7;
const WEEK_HEADER_HEIGHT = 32;

const MONTH_HEIGHT = WEEK_HEADER_HEIGHT + CELL_HEIGHT * ROWS;

function MonthPage({ date, engine }: { date: Date; engine: CalendarEngine }) {
  const today = new Date();
  const config = getConfig();

  const days = engine.getMonthGridByDate(date);
  const currentMonth = date.getMonth();

  return (
    <View style={styles.monthPage}>
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
                  styles.dayNumber,
                  !isCurrentMonth && styles.notCurrentMonthText,
                  isToday && { color: config.themeColor, fontWeight: '600' },
                ]}
              >
                {day.getDate()}
              </Text>
              {/* 日程占位区域（现在空着） */}
              <View style={styles.eventPlaceholder} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function MonthView({ engine, onSelectDay, onMonthChange }: MonthViewProps) {
  const flatListRef = useRef<FlatList>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(engine.getDate());
  const [initialScrollDone, setInitialScrollDone] = useState(false); // 添加标志避免重复滚动
  const config = getConfig();
  const weekDays = WEEK_DAY_NAMES[config.language];

  const orderedWeekDays = [
    ...weekDays.slice(engine.config.weekStartsOn),
    ...weekDays.slice(0, engine.config.weekStartsOn),
  ];

  /** 构造月份序列（以当前月为中心） */
   const months = React.useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => addMonths(engine.getDate(), i - 12));
  }, [engine.getDate()]);

  // 当引擎的日期改变时，更新滚动位置
  useEffect(() => {
    if (!flatListRef.current) return;

    const initialIndex = months.findIndex(
      (month) =>
        month.getFullYear() === engine.getDate().getFullYear() &&
        month.getMonth() === engine.getDate().getMonth()
    );

    if (initialIndex !== -1) {
      flatListRef.current.scrollToIndex({
        index: initialIndex,
        animated: false,
      });
    }
  }, []); // 🔥 只在 mount 执行

  const scrollY = useRef(0);

  const onScroll = (e: any) => {
    scrollY.current = e.nativeEvent.contentOffset.y;

    const index = Math.floor(scrollY.current / MONTH_HEIGHT);
    const month = months[index];

    if (month) {
      onMonthChange?.(month);
      setCurrentMonth(month);
    }
  };


  return (
    <View style={{ flex: 1 }}>
      {/* 星期标题 */}
      <View style={styles.stickyMonth}>
        <Text style={styles.stickyText}>
        {format(currentMonth, 'M月')}
      </Text>
      </View>
      <View style={styles.weekHeader}>
        {orderedWeekDays.map((day, i) => (
          <Text key={i} style={[styles.weekText, { color: 'config.themeColor' }]}>
            {day}
          </Text>
        ))}
      </View>
        
      <FlatList
        ref={flatListRef}
        data={months}
        renderItem={({ item }) => <MonthPage date={item} engine={engine} />}
        keyExtractor={(item) => item.toISOString()}
        decelerationRate="normal"
        showsVerticalScrollIndicator={false}
        initialScrollIndex={12}
        getItemLayout={(_, index) => ({
          length: MONTH_HEIGHT,
          offset: MONTH_HEIGHT * index,
          index,
        })}
        onScroll={onScroll}
        windowSize={3}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  stickyMonth: {
    height: 66,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    zIndex: 10,
    padding: 16,
  },

  stickyText: {
    fontSize: 24,
    fontWeight: '600',
  },

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
  monthPage: {
    height: MONTH_HEIGHT,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '14.28%',
    height: 66,
    paddingTop: 6,
    paddingHorizontal: 4,

    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e5e5',
  },

  dayNumber: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111',
    textAlign: 'center',
  },

  eventPlaceholder: {
    flex: 1,              // 占据剩余空间
    marginTop: 4,
  },

  notCurrentMonth: {
    backgroundColor: '#fafafa',
  },
  notCurrentMonthText: {
    color: '#bbb',
  },
  todayCell: {
    backgroundColor: '#007AFF12',
    borderRadius: 6,
  },
});
