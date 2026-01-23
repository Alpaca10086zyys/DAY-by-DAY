//src/agenda/hooks/useCreateEventModal.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AgendaEvent } from '../types';

interface CreateEventContextType {
  open: (event?: AgendaEvent | Date | null) => void;
  closeModal: () => void;
  isOpen: boolean;
  editingEvent?: AgendaEvent;
  initialDate?: Date;
}

const CreateEventContext = createContext<CreateEventContextType | undefined>(undefined);

export const CreateEventProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AgendaEvent | undefined>();
  const [initialDate, setInitialDate] = useState<Date | undefined>();

  const open = (event?: AgendaEvent | Date | null) => {
    if (event instanceof Date) {
      // 传入 Date，用于新建事件时预填充日期
      setInitialDate(event);
      setEditingEvent(undefined);
    } else if (event && typeof event === 'object' && 'id' in event) {
      // 传入 AgendaEvent，用于编辑
      setEditingEvent(event);
      setInitialDate(undefined);
    } else {
      // 传入 null 或 undefined，新建事件
      setInitialDate(undefined);
      setEditingEvent(undefined);
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingEvent(undefined);
    setInitialDate(undefined);
  }

  return (
    <CreateEventContext.Provider value={{ open, closeModal, isOpen, editingEvent, initialDate }}>
      {children}
    </CreateEventContext.Provider>
  );
};

export const useCreateEvent = () => {
  const ctx = useContext(CreateEventContext);
  if (!ctx) throw new Error('useCreateEvent must be used within CreateEventProvider');
  return ctx;
};
