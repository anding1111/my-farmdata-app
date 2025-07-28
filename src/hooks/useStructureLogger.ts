import { useState, useCallback } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  structure: string;
  operation: string;
  beforeState: any;
  afterState: any;
  metrics: Record<string, any>;
  executionTime: number;
}

export const useStructureLogger = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const logOperation = useCallback((
    structure: string,
    operation: string,
    beforeState: any,
    afterState: any,
    metrics: Record<string, any> = {},
    executionTime: number = 0
  ) => {
    const newLog: LogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      structure,
      operation,
      beforeState: JSON.parse(JSON.stringify(beforeState)),
      afterState: JSON.parse(JSON.stringify(afterState)),
      metrics,
      executionTime
    };

    setLogs(prev => [...prev, newLog]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  return {
    logs,
    isVisible,
    logOperation,
    clearLogs,
    toggleVisibility
  };
};