// src/calendar/CalendarHeader.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CalendarEngine } from './utils/calendarEngine';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  level: 'year' | 'month' | 'week' | 'day';
  onBack: () => void;
  engine: CalendarEngine;
}

export default function CalendarHeader({ level, onBack, engine }: Props) {
  const title = level === 'year' ? engine.getYear().toString() : engine.getTitle(level);

  return (
    <View style={styles.header}>
      {level !== 'year' ? (
        <Pressable onPress={onBack} style={[styles.backPlaceholder, styles.button]} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" style={styles.icon} />
          <Text style={styles.title}>{title}</Text>
        </Pressable>
      ) : (
        <View style={{ width: 1 }}></View>
      )}
      <Pressable onPress={() => {}} style={[styles.rightPlaceholder, styles.button]}>
        <Ionicons name="add" size={24} color="#007AFF" style={styles.icon} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 44,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 12,
  },
  button: {
    height: 44,
    borderRadius: 22,
    borderColor: '#007AFF',
    borderWidth: 1,
    backgroundColor: '#fff',
    padding: 8,
  },
  icon: {
    fontSize: 26,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  backPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightPlaceholder: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});
