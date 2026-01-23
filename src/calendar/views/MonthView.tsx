// src/calendar/views/MonthView.tsx
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { addMonths, format } from 'date-fns';
import { CalendarEngine } from '@/calendar/utils/calendarEngine';
import { useAppConfig } from '@/config/useAppConfig';
import { THEMES } from '@/theme/themes';
import { useTheme } from '@/theme/useTheme';
import { WEEK_DAY_NAMES } from '@/i18n/weekDays';
import { useTranslation } from 'react-i18next';
import { MONTH_NAMES } from '@/i18n/months';
import { useAgenda } from '@/agenda/hooks/AgendaProvider';


interface MonthViewProps {
  engine: CalendarEngine;
  onSelectDay?: () => void;
  onMonthChange?: (date: Date) => void; // 新增回调
}

const CELL_HEIGHT = 56;
const ROWS = 6.5;
const WEEK_HEADER_HEIGHT = 32;
const MONTH_LABEL_HEIGHT = 28;
const ANCHOR_Y = 120; // 紧贴星期标题下方

const MONTH_HEIGHT = WEEK_HEADER_HEIGHT + MONTH_LABEL_HEIGHT + CELL_HEIGHT * ROWS;

function MonthPage({ date, engine }: { date: Date; engine: CalendarEngine }) {
  const today = new Date();
  const theme = useTheme();
  const { config } = useAppConfig();
  const { eventsByDay } = useAgenda();

  const days = engine.getMonthGridByDate(date);
  const currentMonth = date.getMonth();

  const firstDayIndex = days.findIndex((d) => d.getDate() === 1 && d.getMonth() === currentMonth);

  const firstDayRow = Math.floor(firstDayIndex / 7);

  // 获取某天的事件数量（最多显示3个点）
  const getEventCount = (day: Date) => {
    const key = format(day, 'yyyy-MM-dd');
    const events = eventsByDay[key];
    return events ? Math.min(events.length, 3) : 0;
  };

  return (
    <View style={styles.monthPage}>
      {/* 只在第一行之前显示月份 */}
      {firstDayRow === 0 && (
        <View style={styles.monthLabelContainer}>
          <Text style={[styles.monthLabel, { left: `${14.28 * firstDayIndex}%` }]}>{MONTH_NAMES[config.language][date.getMonth()]}</Text>
        </View>
      )}
      <View style={styles.grid}>
        {days.map((day) => {
          const isCurrentMonth = day.getMonth() === currentMonth;
          const isToday = day.toDateString() === today.toDateString();
          const eventCount = getEventCount(day);

          return (
            <View
              key={day.toISOString()}
              style={[
                styles.cell,
                !isCurrentMonth && styles.notCurrentMonth,
                isToday && { ...styles.todayCell, backgroundColor: theme.primarySoft },
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  !isCurrentMonth && styles.notCurrentMonthText,
                  isToday && { color: theme.primary, fontWeight: '600' },
                ]}
              >
                {day.getDate()}
              </Text>
              {/* 事件标记点 */}
              <View style={styles.eventContainer}>
                {eventCount > 0 && (
                  <View style={styles.eventDots}>
                    {Array.from({ length: Math.min(eventCount, 3) }).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.eventDot,
                          { backgroundColor: theme.primary }
                        ]}
                      />
                    ))}
                    {eventCount > 3 && (
                      <Text style={[styles.moreEvents, { color: theme.primary }]}>
                        +{eventCount - 3}
                      </Text>
                    )}
                  </View>
                )}
              </View>
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
  const { config } = useAppConfig();
  const { t } = useTranslation();

  const theme = useTheme();

  const weekDays = WEEK_DAY_NAMES[config.language];
  const orderedWeekDays = [
    ...weekDays.slice(config.weekStartsOn),
    ...weekDays.slice(0, config.weekStartsOn),
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
        month.getMonth() === engine.getDate().getMonth(),
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
    const y = e.nativeEvent.contentOffset.y;

    const anchorAbsoluteY = y + ANCHOR_Y;

    const monthIndex = Math.floor(anchorAbsoluteY / MONTH_HEIGHT);
    const month = months[monthIndex];

    if (month) {
      setCurrentMonth(month);
      onMonthChange?.(month);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 定位线 */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: ANCHOR_Y,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: 'red',
          zIndex: 999,
        }}
      />

      {/* 星期标题 */}
      <View style={styles.stickyMonth}>
        <Text style={styles.stickyText}>{MONTH_NAMES[config.language][currentMonth.getMonth()]}</Text>
      </View>
      <View style={styles.weekHeader}>
        {orderedWeekDays.map((day, i) => (
          <Text key={i} style={[styles.weekText, { color: theme.primary }]}>
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
  monthLabelContainer: {
    height: 28,
    justifyContent: 'flex-end',
    paddingLeft: 12,
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
  },

  eventContainer: {
    flex: 1,
    marginTop: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 12,
  },
  eventDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
    flexWrap: 'wrap',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  moreEvents: {
    fontSize: 8,
    fontWeight: '600',
    marginLeft: 2,
  },

  notCurrentMonth: {
    backgroundColor: '#fafafa',
  },
  notCurrentMonthText: {
    color: '#bbb',
  },
  todayCell: {
    borderRadius: 6,
  },
});
