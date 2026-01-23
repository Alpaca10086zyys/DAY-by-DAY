// src/agenda/CreateEventButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useCreateEvent } from '@/agenda/hooks/useCreateEventModal';

export const CreateEventButton = () => {
  const { open } = useCreateEvent();

  const handlePress = () => {
    open(null); // 点击时传入当前时间
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.text}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  text: {
    color: 'white',
    fontSize: 28,
  },
});
