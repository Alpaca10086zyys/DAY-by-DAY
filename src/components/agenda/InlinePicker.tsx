// src/agenda/components/InlinePicker.tsx
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Props {
  value: Date;
  mode: 'date' | 'time';
  onChange: (date: Date) => void;
}

export const InlinePicker: React.FC<Props> = ({
  value,
  mode,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      <DateTimePicker
        value={value}
        mode={mode}
        display={
          Platform.OS === 'ios'
            ? mode === 'date'
              ? 'inline'
              : 'spinner'
            : 'default'
        }
        minuteInterval={5}
        onChange={(_, d) => d && onChange(d)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
});
