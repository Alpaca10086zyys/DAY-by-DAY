// src/agenda/components/DateTimeRow.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { mergeDateTime } from './utils';
import { Collapse } from '@/animate/Collapse';
import { useTheme } from '@/theme/useTheme';

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

  const theme = useTheme();

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const toggle = (mode: 'date' | 'time') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
            ]}
            onPress={() => toggle('date')}
          >
            <Text
              style={isDateActive && { color: theme.primary }}
            >
              {format(value, 'yyyy年MM月dd日')}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.capsule,
            ]}
            onPress={() => toggle('time')}
          >
            <Text
              style={isTimeActive && { color: theme.primary }}
            >
              {format(value, 'HH:mm')}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 👇 展开区就在这一行下面 */}
      <Collapse isOpen={isDateActive} maxHeight={340}>
        <View style={styles.collapse}>
          <DateTimePicker
            value={value}
            mode="date"
            display="inline"
            onChange={(_, d) => d && onChange(mergeDateTime(value, d, 'date'))}
          />
        </View>
      </Collapse>


      <Collapse isOpen={isTimeActive} maxHeight={220}>
        <View style={styles.collapse}>
          <DateTimePicker
            value={value}
            mode="time"
            display="spinner"
            minuteInterval={5}
            onChange={(_, d) => d && onChange(mergeDateTime(value, d, 'time'))}
          />
        </View>
      </Collapse>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'pink',
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
  activeText: {
    color: 'white',
  },
  collapse: {
    marginTop: 0,
  },
});