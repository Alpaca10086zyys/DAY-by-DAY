// InlineDateTimeRange.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { DateTimeRow } from './DateTimeRow';
import { useTranslation } from 'react-i18next';

type Active =
  | { type: 'start' | 'end'; mode: 'date' | 'time' }
  | null;

interface Props {
  start: Date;
  end: Date;
  onChange: (s: Date, e: Date) => void;
}

export const InlineDateTimeRange: React.FC<Props> = ({
  start,
  end,
  onChange,
}) => {
  const [active, setActive] = useState<Active>(null);
  const { t } = useTranslation();

  return (
    <View>
      <DateTimeRow
        label={t('agenda.start')}
        type="start"
        value={start}
        active={active}
        setActive={setActive}
        onChange={(d) => onChange(d, end)}
      />

      <DateTimeRow
        label={t('agenda.end')}
        type="end"
        value={end}
        active={active}
        setActive={setActive}
        onChange={(d) => onChange(start, d)}
      />
    </View>
  );
};
