// src/agenda/components/DateTimeRow.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { mergeDateTime } from './utils';

interface Props {
  label: string;
  type: 'start' | 'end';
  value: Date;
  active: { type: 'start' | 'end'; mode: 'date' | 'time' } | null;
  setActive: (v: Props['active']) => void;
  onChange: (next: Date) => void;
}

export const DateTimeRow: React.FC<Props> = ({
  label,
  type,
  value,
  active,
  setActive,
  onChange,
}) => {
  const isDateActive =
    active?.type === type && active?.mode === 'date';
  const isTimeActive =
    active?.type === type && active?.mode === 'time';

  const toggle = (mode: 'date' | 'time') => {
    if (active?.type === type && active?.mode === mode) {
      setActive(null); // 再点收起
    } else {
      setActive({ type, mode });
    }
  };

  return (
    <View>
      {/* 行本体 */}
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>

        <View style={styles.capsules}>
          <Pressable
            style={[
              styles.capsule,
              isDateActive && styles.activeCapsule,
            ]}
            onPress={() => toggle('date')}
          >
            <Text
              style={isDateActive && styles.activeText}
            >
              {format(value, 'yyyy年MM月dd日')}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.capsule,
              isTimeActive && styles.activeCapsule,
            ]}
            onPress={() => toggle('time')}
          >
            <Text
              style={isTimeActive && styles.activeText}
            >
              {format(value, 'HH:mm')}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 👇 展开区就在这一行下面 */}
      {isDateActive && (
        <View style={styles.collapse}>
          <DateTimePicker
            value={value}
            mode="date"
            display="inline"
            onChange={(_, d) => d && onChange(mergeDateTime(value, d, 'date'))}
          />
        </View>
      )}

      {isTimeActive && (
        <View style={styles.collapse}>
          <DateTimePicker
            value={value}
            mode="time"
            display="spinner"
            minuteInterval={5}
            onChange={(_, d) => d && onChange(mergeDateTime(value, d, 'time'))}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginBottom: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'pink',
    height: 40,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: '#666',
    lineHeight: 20,
  },
  capsules: {
    flexDirection: 'row',
    gap: 8,
  },
  capsule: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f2f2f7',
  },
  activeCapsule: {
    backgroundColor: '#007aff',
  },
  activeText: {
    color: 'white',
  },
  collapse: {
    marginTop: 8,
  },
});