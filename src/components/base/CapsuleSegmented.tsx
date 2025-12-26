import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
} from 'react-native';

interface Option<T extends string> {
  label: string;
  value: T;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;

  height?: number;
  activeColor?: string;
  inactiveColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
}

export function CapsuleSegmented<T extends string>({
  options,
  value,
  onChange,
  height = 36,
  activeColor = '#111',
  inactiveColor = '#666',
  backgroundColor = '#eee',
  borderRadius = 18,
}: Props<T>) {
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const itemWidth = containerWidth / options.length;

  const activeIndex = options.findIndex(o => o.value === value);

  useEffect(() => {
    if (containerWidth === 0) return;

    Animated.spring(translateX, {
      toValue: activeIndex * itemWidth,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
    }).start();
  }, [activeIndex, containerWidth]);

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  return (
    <View
      style={[
        styles.container,
        { height, borderRadius, backgroundColor },
      ]}
      onLayout={onLayout}
    >
      {/* 胶囊背景 */}
      {containerWidth > 0 && (
        <Animated.View
          style={[
            styles.activeCapsule,
            {
              width: itemWidth,
              height,
              borderRadius,
              backgroundColor: activeColor,
              transform: [{ translateX }],
            },
          ]}
        />
      )}

      {options.map(option => {
        const isActive = option.value === value;

        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.item, { height }]}
            activeOpacity={0.8}
            onPress={() => onChange(option.value)}
          >
            <Text
              style={{
                color: isActive ? '#fff' : inactiveColor,
                fontWeight: '500',
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  activeCapsule: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
