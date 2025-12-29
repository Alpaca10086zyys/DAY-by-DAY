import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Platform, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { useCreateEvent } from '@/agenda/hooks/useCreateEventModal';
import { AgendaEvent, ThemeKey } from '@/agenda/types';
import { createEvent } from '@/agenda/models/event';
import { ColorSelector } from '@/components/base/ColorSelector';
import { InlineDateTimeRange } from './InlineDateTimeRange';

const COLORS: ThemeKey[] = ['blue', 'green', 'orange'];

interface EventModalProps {
  onSave: (event: AgendaEvent) => void;
}


export const EventModal: React.FC<EventModalProps> = ({ onSave }) => {
  const { isOpen, closeModal, editingEvent } = useCreateEvent();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date(Date.now() + 60 * 60 * 1000));
  const [color, setColor] = useState<ThemeKey>('blue');

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description ?? '');
      setStart(new Date(editingEvent.startAt));
      setEnd(new Date(editingEvent.endAt));
      setColor(editingEvent.color);
    }
  }, [editingEvent, isOpen]);

  const handleSave = () => {
    const event: AgendaEvent = editingEvent
      ? {
          ...editingEvent,
          title,
          description,
          startAt: start.getTime(),
          endAt: end.getTime(),
          updatedAt: Date.now(),
        }
      : createEvent({
          title,
          description,
          startAt: start.getTime(),
          endAt: end.getTime(),
          color,
        });

    onSave(event);
    closeModal();
  };

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={closeModal}      // 点击阴影关闭
      onBackButtonPress={closeModal}     // Android 返回键关闭
      swipeDirection="down"              // 向下滑动关闭
      onSwipeComplete={closeModal}
      animationIn="slideInUp"            // 上滑弹出
      animationOut="slideOutDown"        // 下滑消失
    //   backdropTransitionOutTiming={0}    // 避免闪烁
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>标题</Text>
          <TextInput
            style={styles.iosInput}
            placeholder="输入日程标题"
            placeholderTextColor="#8E8E93"
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>备注</Text>
          <TextInput
            style={styles.iosInput}
            placeholder="在此输入备注"
            placeholderTextColor="#8E8E93"
            value={description}
            onChangeText={setDescription}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>颜色</Text>
           <ColorSelector
              value={color} options={COLORS} onChange={(theme: ThemeKey) => setColor(theme)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>时间范围</Text>
          <InlineDateTimeRange
            start={start}
            end={end}
            onChange={(s, e) => {
              setStart(s);
              setEnd(e);
            }}
          />
        </View>
        <Button title="保存" onPress={handleSave} />
        <Button title="取消" onPress={closeModal} color="#aaa" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',   // 底部弹出
    margin: 0,                    // 占满屏幕
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    gap: 18,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: 200,
  },
  section: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  iosInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    color: '#000',
  }

});
