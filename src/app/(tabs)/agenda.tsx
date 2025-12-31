import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { CreateEventButton } from '@/agenda/CreateEventButton';
import { useAgenda } from '@/agenda/hooks/useAgenda';
import { formatTimeRange, getSoftColor } from '@/agenda/utils/agendaUI';
import { AgendaEvent } from '@/agenda/types';
import { AgendaDaySection } from '@/components/agenda/AgendaDaySection';

function groupByDay(events) {
  const map: Record<string, AgendaEvent[]> = {};

  events.forEach(e => {
    const key = format(e.startAt, 'yyyy-MM-dd');
    if (!map[key]) map[key] = [];
    map[key].push(e);
  });

  return Object.entries(map).map(([date, data]) => ({
    date,
    data,
  }));
}

export default function AgendaScreen() {
  const { sortedEvents, reloadEvents, removeEvent } = useAgenda();
  const [refreshing, setRefreshing] = useState(false);

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const recentEvents = sortedEvents.filter(
    e => e.startAt >= oneMonthAgo.getTime()
  );

  const handleDelete = (id: string) => {
    removeEvent(id);
  };

  const handleEdit = (event: AgendaEvent) => {
    // 打开你已有的 Create / Edit Event Modal
    // openEditModal(event);
  };

  const sections = useMemo(() => {
    const map: Record<string, any[]> = {};
    sortedEvents.forEach(e => {
      const key = new Date(e.startAt).toISOString().slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return Object.entries(map).map(([date, events]) => ({
      date,
      events,
    }));
  }, [sortedEvents]);

  const onRefresh = async () => {
    setRefreshing(true);
    // 这里将来可以触发 reload 本地 / DB
    setTimeout(() => { reloadEvents(); setRefreshing(false); }, 500);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>日程</Text>
        <CreateEventButton />
      </View>

      <FlatList
        data={sections}
        keyExtractor={item => item.date}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <AgendaDaySection date={item.date} events={item.events} onDelete={handleDelete} onEdit={handleEdit} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },

  dateTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    color: '#444',
  },

  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },

  timeline: {
    width: 20,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginTop: 4,
  },
  line: {
    flex: 1,
    width: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 2,
  },

  card: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  desc: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});
