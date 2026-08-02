import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// expo-notifications is native-only. We load it lazily (never on web) so its
// module init — which touches browser-only globals — is never evaluated during
// the web build's server render. Every exported call is a no-op on web.
const isWeb = Platform.OS === 'web';

function getNotifications(): typeof import('expo-notifications') | null {
  if (isWeb) return null;
  return require('expo-notifications') as typeof import('expo-notifications');
}

const SETTINGS_KEY = 'kneerun.reminder.v1';

type ReminderSettings = { enabled: boolean; hour: number; minute: number };

const DEFAULT_SETTINGS: ReminderSettings = { enabled: false, hour: 9, minute: 0 };

// Show reminders and milestones as a banner even when the app is foregrounded.
async function configureNotifications() {
  const N = getNotifications();
  if (!N) return;
  N.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  if (Platform.OS === 'android') {
    await N.setNotificationChannelAsync('default', {
      name: 'Reminders',
      importance: N.AndroidImportance.DEFAULT,
    });
  }
}

async function requestPermission(): Promise<boolean> {
  const N = getNotifications();
  if (!N) return false;
  const current = await N.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await N.requestPermissionsAsync();
  return asked.granted;
}

// Reschedule the single daily reminder from scratch. Cancelling everything is
// safe because milestone notifications fire immediately and aren't scheduled.
async function scheduleDailyReminder(settings: ReminderSettings, name: string) {
  const N = getNotifications();
  if (!N) return;
  await N.cancelAllScheduledNotificationsAsync();
  if (!settings.enabled) return;
  await N.scheduleNotificationAsync({
    content: {
      title: name ? `Time to run, ${name}` : 'Time to run',
      body: "Your knee's ready when you are. Today's session is waiting.",
    },
    trigger: {
      type: N.SchedulableTriggerInputTypes.DAILY,
      hour: settings.hour,
      minute: settings.minute,
    },
  });
}

async function fireMilestone(title: string, body: string) {
  const N = getNotifications();
  if (!N) return;
  await N.scheduleNotificationAsync({ content: { title, body }, trigger: null });
}

async function fetchReminderSettings(): Promise<ReminderSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(raw);
    return {
      enabled: !!parsed.enabled,
      hour: Number.isInteger(parsed.hour) ? parsed.hour : 9,
      minute: Number.isInteger(parsed.minute) ? parsed.minute : 0,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

async function saveReminderSettings(settings: ReminderSettings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Load reminder settings and expose an updater that persists and reschedules.
function useReminder(name: string) {
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminderSettings().then((stored) => {
      setSettings(stored);
      setLoading(false);
    });
  }, []);

  const update = useCallback(
    async (next: ReminderSettings) => {
      setSettings(next);
      await saveReminderSettings(next);
      await scheduleDailyReminder(next, name);
    },
    [name],
  );

  return { settings, loading, update };
}

export {
  configureNotifications,
  requestPermission,
  scheduleDailyReminder,
  saveReminderSettings,
  fireMilestone,
  useReminder,
  DEFAULT_SETTINGS,
};
export type { ReminderSettings };
