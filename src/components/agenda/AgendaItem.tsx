// src/components/agenda/AgendaItem.tsx
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { formatTimeRange, getSoftColor } from '@/agenda/utils/agendaUI';
import { AgendaEvent } from '@/agenda/types';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

type Props = {
  event: AgendaEvent;
  onDelete: (id: string) => void;
  onEdit: (event: AgendaEvent) => void;
};

export function AgendaItem({ event, onDelete, onEdit }: Props) {
  
  const handleDeletePress = () => {
    Alert.alert(
      '删除日程',
      '确定要删除这个日程吗？此操作无法撤销。',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => onDelete(event.id),
        },
      ],
    );
  };

  const renderRightActions = () => (
    <View style={styles.actionsContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.action,
          pressed && styles.actionPressed,
        ]}
        onPress={handleDeletePress}
      >
        <Ionicons name="trash" size={26} color="#FF3B30" />
      </Pressable>
    </View>
  );


  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootLeft={false}
      overshootRight={false}
    >
      <View style={styles.row}>
        {/* 时间线 */}
        <View style={styles.timeline}>
          <View style={styles.dot} />
          <View style={styles.line} />
        </View>

        {/* 卡片（可点击） */}
        <View style={[styles.card, {backgroundColor: '#fff', padding: 0}]}>
          <Pressable
          onPress={() => onEdit(event)}
          style={({ pressed }) => [
            styles.card,
            { backgroundColor: getSoftColor(event.color) },
            pressed && styles.cardPressed,
          ]}
        >
          <View style={styles.text}>
            <Text style={styles.title}>{event.title}</Text>
            {!!event.description && (
              <Text style={styles.desc}>{event.description}</Text>
            )}
          </View>

          <Text style={styles.time}>
            {formatTimeRange(event.startAt, event.endAt)}
          </Text>
        </Pressable>
        </View>
      </View>
    </Swipeable>
  );
}


const styles = StyleSheet.create({
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
  },

  text: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  desc: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: '#666',
  },

  actionsContainer: {
    height: '100%',
    justifyContent: 'center',   // 👈 垂直居中
    alignItems: 'center',
    paddingHorizontal: 44,
  },

  action: {
    height: 36,             // 👈 行高 = Agenda 行高
    width: 36,                  // iOS 常见 action 宽度
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgb(249, 214, 209)', // 👈 按下时更亮
  },

  actionPressed: {
    backgroundColor: 'rgb(255, 191, 183)', // 👈 按下时更亮
  },

  edit: {
    backgroundColor: '#4A90E2',
  },
  delete: {
    backgroundColor: '#4a4a4a',
  },

  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

});
