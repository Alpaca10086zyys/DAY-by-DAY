// src/components/agenda/AgendaDaySection.tsx
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { AgendaEvent } from '@/agenda/types';
import { AgendaItem } from './AgendaItem';

type Props = {
  date: string;
  events: AgendaEvent[];
  onDelete: (id: string) => void;
  onEdit: (event: AgendaEvent) => void;
};

export function AgendaDaySection({ date, events, onDelete, onEdit }: Props) {
  return (
    <View>
      <Text style={styles.date}>
        {format(new Date(date), 'MM月dd日')}
      </Text>

      <View style={{ gap: 12 }}>
        {events.map(event => (
          <AgendaItem
            key={event.id}
            event={event}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  date: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    color: '#444',
  },
});
