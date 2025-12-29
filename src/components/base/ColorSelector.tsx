import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { THEMES, ThemeKey } from '@/theme/themes';

interface Props {
  value: ThemeKey;
  options: ThemeKey[];
  onChange: (theme: ThemeKey) => void;
}

export function ColorSelector({ value, options, onChange }: Props) {
  return (
    <View style={styles.row}>
      {options.map(themeKey => {
        const active = themeKey=== value;
        const color = THEMES[themeKey];

        return (
          <TouchableOpacity
            key={themeKey}
            onPress={() => onChange(themeKey)}
            style={[
              styles.color,
              { backgroundColor: color.primary },
              active && styles.active,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 8,
  },
  color: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 12,
  },
  active: {
    borderWidth: 3,
    borderColor: '#000',
  },
});
