import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { THEMES, ThemeKey } from '@/theme/themes';
import { THEME_META } from '@/theme/themeMeta';
import { useTheme } from '@/theme/useTheme';
import { Collapse } from '@/animate/Collapse';
import { useTranslation } from 'react-i18next';

interface Props {
  value: ThemeKey;
  options: ThemeKey[];
  onChange: (v: ThemeKey) => void;
}

export const CollapseColorPicker: React.FC<Props> = ({
  value,
  options,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const currentColor = THEMES[value];
  const currentLabel = t(THEME_META[value].labelKey);

  const theme = useTheme();

  const toggle = () => setOpen(v => !v);

  const select = (v: ThemeKey) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <View>
      {/* 胶囊 */}
      <Pressable
        style={[
          styles.capsule,
        ]}
        onPress={toggle}
      >
        <View
          style={[
            styles.dot,
            { backgroundColor: currentColor.primary },
          ]}
        />
        <Text
          style={[
            styles.label,
            open && { color: theme.primary },
          ]}
        >
          {currentLabel}
        </Text>
      </Pressable>

      {/* 👇 行内展开 */}
      <Collapse isOpen={open}>
        <View style={styles.panel}>
          {options.map(key => {
            const theme = THEMES[key];
            const meta = THEME_META[key];
            const active = key === value;

            return (
              <Pressable
                key={key}
                onPress={() => select(key)}
                style={[
                  styles.option,
                  active && styles.optionActive,
                ]}
              >
                <View
                  style={[
                    styles.optionDot,
                    { backgroundColor: theme.primary },
                  ]}
                />
                <Text style={styles.optionLabel}>
                  {t(meta.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Collapse>
    </View>
  );
};


const styles = StyleSheet.create({
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#f2f2f7',
    gap: 8,
  },
  label: {
    fontSize: 15,
    color: '#333',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },

  /* 展开面板 */
  panel: {
    marginTop: 8,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  optionActive: {
    opacity: 0.5,
  },
  optionDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
  },
});
