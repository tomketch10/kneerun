import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import type { SessionLog } from './types';

const STORAGE_KEY = 'kneerun.logs.v1';

async function fetchLogs(): Promise<SessionLog[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SessionLog[]) : [];
  } catch {
    return [];
  }
}

async function saveLogs(logs: SessionLog[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

// Load the log list once and expose append/reset that persist and re-render.
function useLogs() {
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs().then((stored) => {
      setLogs(stored);
      setLoading(false);
    });
  }, []);

  const append = useCallback((log: SessionLog) => {
    setLogs((current) => {
      const next = [...current, log];
      saveLogs(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setLogs([]);
    saveLogs([]);
  }, []);

  return { logs, loading, append, reset };
}

export { useLogs };
