import React, { createContext, useContext, ReactNode } from 'react';
import { useDataStructures } from '@/hooks/useDataStructures';

// Crear el contexto con el tipo del hook
const DataStructuresContext = createContext<ReturnType<typeof useDataStructures> | undefined>(undefined);

export const DataStructuresProvider = ({ children }: { children: ReactNode }) => {
  console.log('🔧 DataStructuresProvider mounting...');
  const dataStructures = useDataStructures();
  console.log('✅ DataStructuresProvider data loaded:', !!dataStructures);

  return (
    <DataStructuresContext.Provider value={dataStructures}>
      {children}
    </DataStructuresContext.Provider>
  );
};

export const useDataStructuresContext = () => {
  const context = useContext(DataStructuresContext);
  if (context === undefined) {
    throw new Error('useDataStructuresContext must be used within a DataStructuresProvider');
  }
  return context;
};