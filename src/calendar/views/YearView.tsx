import React, { useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { CalendarEngine } from '@/calendar/utils/calendarEngine';
import { addYears, format } from 'date-fns';
import MiniMonth from './MiniMonth';
import { useTheme } from '@/theme/useTheme';

interface YearViewProps {
  engine: CalendarEngine;
  onSelectMonth: (month: Date) => void;
}

const YEAR_HEADER_HEIGHT = 60;
const YEAR_GRID_HEIGHT = Dimensions.get('window').height * 0.75; // 大约75%的屏幕高度
const YEAR_HEIGHT = YEAR_HEADER_HEIGHT + YEAR_GRID_HEIGHT;

function YearPage({ year, engine, onSelectMonth }: { year: number; engine: CalendarEngine; onSelectMonth: (month: Date) => void }) {
  const theme = useTheme();
  const months = useMemo(() => {
    const months: Date[] = [];
    for (let i = 0; i < 12; i++) {
      months.push(new Date(year, i, 1));
    }
    return months;
  }, [year]);

  return (
    <View style={styles.yearPage}>
      <View style={styles.yearHeader}>
        <Text style={[styles.yearTitle, { color: theme.primary }]}>{year}</Text>
      </View>
      <View style={styles.grid}>
        {months.map((month) => (
          <TouchableOpacity
            key={month.toISOString()}
            style={styles.cell}
            onPress={() => onSelectMonth(month)}
            activeOpacity={0.7}
          >
            <MiniMonth month={month} engine={engine} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function YearView({ engine, onSelectMonth }: YearViewProps) {
  const flatListRef = useRef<FlatList>(null);
  const currentYear = engine.getDate().getFullYear();

  // 生成多年数据（当前年前后各10年，共21年）
  const years = useMemo(() => {
    return Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  }, [currentYear]);

  // 初始滚动到当前年
  useEffect(() => {
    if (flatListRef.current) {
      const initialIndex = 10; // 当前年在中间
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      }, 100);
    }
  }, []);

  const getItemLayout = (_: any, index: number) => ({
    length: YEAR_HEIGHT,
    offset: YEAR_HEIGHT * index,
    index,
  });

  return (
    <FlatList
      ref={flatListRef}
      data={years}
      keyExtractor={(year) => year.toString()}
      renderItem={({ item: year }) => (
        <YearPage year={year} engine={engine} onSelectMonth={onSelectMonth} />
      )}
      getItemLayout={getItemLayout}
      decelerationRate="normal"
      showsVerticalScrollIndicator={false}
      initialScrollIndex={10}
      windowSize={3}
      initialNumToRender={3}
      maxToRenderPerBatch={2}
      removeClippedSubviews={true}
      updateCellsBatchingPeriod={50}
      onScrollToIndexFailed={(info) => {
        // 如果滚动失败，延迟重试
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: info.index,
            animated: false,
          });
        }, 100);
      }}
    />
  );
}

const styles = StyleSheet.create({
  yearPage: {
    height: YEAR_HEIGHT,
    paddingBottom: 20,
  },
  yearHeader: {
    height: YEAR_HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 12,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
  },
  yearTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#111',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    height: YEAR_GRID_HEIGHT,
  },
  cell: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 6,
  },
});
