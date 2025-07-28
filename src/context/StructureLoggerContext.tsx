import React, { createContext, useContext, ReactNode } from 'react';
import { useStructureLogger } from '@/hooks/useStructureLogger';

interface StructureLoggerContextType {
  logs: any[];
  isVisible: boolean;
  activeStructure: string | null;
  logOperation: (
    structure: string,
    operation: string,
    beforeState: any,
    afterState: any,
    metrics?: Record<string, any>,
    executionTime?: number
  ) => void;
  clearLogs: () => void;
  toggleVisibility: () => void;
  setActiveStructure: (structure: string | null) => void;
}

const StructureLoggerContext = createContext<StructureLoggerContextType | undefined>(undefined);

export { StructureLoggerContext };

export const StructureLoggerProvider = ({ children }: { children: ReactNode }) => {
  const logger = useStructureLogger();

  return (
    <StructureLoggerContext.Provider value={logger}>
      {children}
    </StructureLoggerContext.Provider>
  );
};

export const useStructureLoggerContext = () => {
  const context = useContext(StructureLoggerContext);
  if (context === undefined) {
    throw new Error('useStructureLoggerContext must be used within a StructureLoggerProvider');
  }
  return context;
};