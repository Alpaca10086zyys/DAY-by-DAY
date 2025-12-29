// src/animate/Collapse.tsx
import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

interface CollapseProps {
  isOpen: boolean;
  maxHeight?: number; // 展开高度
  children: React.ReactNode;
}

export const Collapse: React.FC<CollapseProps> = ({ isOpen, maxHeight = 300, children }) => {
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isOpen ? maxHeight : 0,
      duration: 250, // 动画时长
      useNativeDriver: false, // 高度动画不能用 native driver
    }).start();
  }, [isOpen]);

  return (
    <Animated.View style={{ overflow: 'hidden', height: animatedHeight }}>
      {children}
    </Animated.View>
  );
};
