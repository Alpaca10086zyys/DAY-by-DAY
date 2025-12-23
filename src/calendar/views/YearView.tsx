import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { CalendarEngine } from '@/calendar/utils/calendarEngine';
import MiniMonth from './MiniMonth';

interface YearViewProps {
  engine: CalendarEngine;
  onSelectMonth: (month: Date) => void;
}

export default function YearView({ engine, onSelectMonth }: YearViewProps) {
  const year = engine.getDate().getFullYear();
  const months = engine.getYearMonths();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.yearTitle}>{year}</Text>

      <View style={styles.grid}>
        {months.map((month) => (
          <TouchableOpacity
            key={month.toISOString()}
            style={styles.cell}
            onPress={() => onSelectMonth(month)}
          >
            <MiniMonth month={month} engine={engine} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcf0',
  },
  yearTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  cell: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 6,
  },
});
