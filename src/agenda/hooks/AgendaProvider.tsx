import React, { createContext, useContext } from 'react';
import { useAgenda as useAgendaImpl } from './useAgenda';

const AgendaContext = createContext<ReturnType<typeof useAgendaImpl> | null>(null);

export const AgendaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const agenda = useAgendaImpl();
  return (
    <AgendaContext.Provider value={agenda}>
      {children}
    </AgendaContext.Provider>
  );
};

export const useAgenda = () => {
  const ctx = useContext(AgendaContext);
  if (!ctx) throw new Error('useAgenda must be used within AgendaProvider');
  return ctx;
};
