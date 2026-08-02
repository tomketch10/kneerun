import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'kneerun.profile.v1';

type Profile = { name: string };

async function fetchProfile(): Promise<Profile> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return { name: '' };
  try {
    const parsed = JSON.parse(raw);
    return { name: typeof parsed?.name === 'string' ? parsed.name : '' };
  } catch {
    return { name: '' };
  }
}

// Load the runner's profile once and expose a setter that persists and re-renders.
function useProfile() {
  const [profile, setProfile] = useState<Profile>({ name: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile().then((stored) => {
      setProfile(stored);
      setLoading(false);
    });
  }, []);

  const setName = useCallback((name: string) => {
    const next = { name: name.trim() };
    setProfile(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  return { profile, loading, setName };
}

export { useProfile };
export type { Profile };
