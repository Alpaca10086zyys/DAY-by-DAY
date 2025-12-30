import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { CreateEventButton } from '@/agenda/CreateEventButton';
import { useAgenda } from '@/agenda/hooks/useAgenda';
import { formatTimeRange, getSoftColor } from '@/agenda/utils/agendaUI';
import { AgendaEvent } from '@/agenda/types';


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
  const { sortedEvents, reloadEvents } = useAgenda();
  const [refreshing, setRefreshing] = useState(false);

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const recentEvents = sortedEvents.filter(
    e => e.startAt >= oneMonthAgo.getTime()
  );

  const sections = useMemo(() => groupByDay(recentEvents), [recentEvents]);

  const onRefresh = async () => {
    setRefreshing(true);
    // 这里将来可以触发 reload 本地 / DB
    setTimeout(() => { reloadEvents(); setRefreshing(false); }, 500);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>日程</Text>
        <CreateEventButton />
      </View>

      <FlatList
        data={sections}
        keyExtractor={item => item.date}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View>
            {/* 日期标题 */}
            <Text style={styles.dateTitle}>
              {format(new Date(item.date), 'MM月dd日')}
            </Text>

            {item.data.map(event => (
              <View key={event.id} style={styles.row}>
                {/* 时间线 */}
                <View style={styles.timeline}>
                  <View style={styles.dot} />
                  <View style={styles.line} />
                </View>

                {/* 事件卡片 */}
                <View
                  style={[
                    styles.card,
                    { backgroundColor: getSoftColor(event.color) },
                  ]}
                >
                  <View style={styles.text}>
                     <Text style={styles.titleText}>{event.title}</Text>
                      {!!event.description && (
                        <Text style={styles.desc}>{event.description}</Text>
                      )}
                  </View>
                  <View>
                    <Text style={styles.time}>
                      {formatTimeRange(event.startAt, event.endAt)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
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
