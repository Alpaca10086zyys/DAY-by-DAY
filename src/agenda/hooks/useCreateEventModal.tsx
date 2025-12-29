//src/agenda/hooks/useCreateEventModal.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AgendaEvent } from '../types';

interface CreateEventContextType {
  open: (event?: AgendaEvent) => void;
  closeModal: () => void;
  isOpen: boolean;
  editingEvent?: AgendaEvent;
}

const CreateEventContext = createContext<CreateEventContextType | undefined>(undefined);

export const CreateEventProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AgendaEvent | undefined>();
  
  const open = (event?: AgendaEvent) => {
    setEditingEvent(event);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingEvent(undefined);
  }

  return (
    <CreateEventContext.Provider value={{ open, closeModal, isOpen, editingEvent }}>
      {children}
    </CreateEventContext.Provider>
  );
};

export const useCreateEvent = () => {
  const ctx = useContext(CreateEventContext);
  if (!ctx) throw new Error('useCreateEvent must be used within CreateEventProvider');
  return ctx;
};
