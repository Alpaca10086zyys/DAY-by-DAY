// app/(tabs)/calendar.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { CalendarEngine } from '@/calendar/utils/calendarEngine';
import YearView from '@/calendar/views/YearView';
import MonthView from '@/calendar/views/MonthView';
import WeekView from '@/calendar/views/WeekView';
import DayView from '@/calendar/views/DayView';
import CalendarHeader from '@/calendar/CalendarHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

type Level = 'year' | 'month' | 'week' | 'day';

export default function CalendarScreen() {
  const [engine] = useState(new CalendarEngine(new Date()));
  const [stack, setStack] = useState<Level[]>(['year', 'month']);
  const [visibleDate, setVisibleDate] = useState<Date>(engine.getDate());

  const current = stack[stack.length - 1];

  const push = (level: Level) => {
    setStack((s) => [...s, level]);
  };

  const pop = () => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
    console.log('Stack:', stack);
  };

  const onSelectMonth = (month: Date) => {
    engine.setDate(month); // 🔥 关键：更新全局时间锚点
    push('month'); // 进入 month 视图
  };

  const handleMonthChange = (date: Date) => {
    // 只更新锚点，不改变当前视图状态
    engine.setAnchorDate(date);
    // console.log('Month changed to:', date);
    setVisibleDate(date);
  };

  const renderView = () => {
    switch (current) {
      case 'year':
        return <YearView engine={engine} onSelectMonth={onSelectMonth} />;
      case 'month':
        return (
          <MonthView
            engine={engine}
            onSelectDay={() => push('week')}
            onMonthChange={handleMonthChange}
          />
        );
      case 'week':
        return <WeekView engine={engine} onSelectDay={() => push('day')} />;
      case 'day':
        return <DayView engine={engine} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={styles.container}>
        <CalendarHeader level={current} onBack={pop} engine={engine} visibleDate={visibleDate} />
        {renderView()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#f5fcff',
  },
});
