import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { requestPermission, useReminder } from '@/program/notifications';
import { currentRef, getProgram, isDone, prescription, runningMinutes } from '@/program/program';
import { useProfile } from '@/program/profile';
import { useLogs } from '@/program/storage';
import type { Symptom } from '@/program/types';
import { colors, fonts, radius, space } from '@/theme';

const SYMPTOM_LEGEND: { key: Symptom; label: string }[] = [
  { key: 'good', label: 'Good' },
  { key: 'niggle', label: 'Niggle' },
  { key: 'sore', label: 'Sore' },
];

function formatTime(hour: number, minute: number): string {
  const period = hour < 12 ? 'AM' : 'PM';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${minute < 10 ? '0' : ''}${minute} ${period}`;
}

export default function PlanScreen() {
  const { logs, loading, reset } = useLogs();
  const { profile } = useProfile();
  const { settings, update } = useReminder(profile.name);
  const program = getProgram();
  const current = useMemo(() => currentRef(logs), [logs]);

  async function toggleReminder(on: boolean) {
    const granted = on ? await requestPermission() : false;
    update({ ...settings, enabled: on && granted });
  }

  function shiftHour(delta: number) {
    update({ ...settings, hour: (settings.hour + delta + 24) % 24 });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyebrow}>PHASE 03 · RUN</Text>
        <Text style={styles.title}>{program.name}</Text>
        <Text style={styles.summary}>{program.summary}</Text>

        {logs.length > 0 && (
          <View style={styles.trend}>
            <Text style={styles.trendTitle}>How the knee's felt</Text>
            <View style={styles.trendDots}>
              {logs.map((log, i) => (
                <View key={i} style={[styles.trendDot, { backgroundColor: colors.symptom[log.symptom] }]} />
              ))}
            </View>
            <View style={styles.legend}>
              {SYMPTOM_LEGEND.map((s) => (
                <View key={s.key} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.symptom[s.key] }]} />
                  <Text style={styles.legendText}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {program.weeks.map((week) => (
          <View key={week.week} style={styles.week}>
            <View style={styles.weekHead}>
              <Text style={styles.weekNum}>WEEK {week.week}</Text>
              <Text style={styles.weekFocus}>{week.focus}</Text>
            </View>
            {week.sessions.map((session, index) => {
              const ref = { week: week.week, session: index + 1 };
              const done = isDone(logs, ref);
              const isCurrent = !loading && current?.week === ref.week && current?.session === ref.session;
              return (
                <View key={index} style={[styles.session, isCurrent && styles.sessionCurrent]}>
                  <View style={[styles.dot, done && styles.dotDone, isCurrent && styles.dotCurrent]}>
                    {done && <Text style={styles.tick}>✓</Text>}
                  </View>
                  <View style={styles.sessionBody}>
                    <Text style={[styles.rx, done && styles.rxDone]}>{prescription(session)}</Text>
                    <Text style={styles.meta}>{runningMinutes(session)}′ running</Text>
                  </View>
                  {isCurrent && <Text style={styles.nowTag}>NOW</Text>}
                </View>
              );
            })}
          </View>
        ))}

        <View style={styles.reminderCard}>
          <View style={styles.reminderRow}>
            <Text style={styles.reminderTitle}>Daily reminder</Text>
            <Switch
              value={settings.enabled}
              onValueChange={toggleReminder}
              trackColor={{ true: colors.accent, false: colors.lineStrong }}
              thumbColor={colors.bgAlt}
            />
          </View>
          {settings.enabled && (
            <View style={styles.reminderTimeRow}>
              <Text style={styles.reminderTimeLabel}>Nudge me at</Text>
              <View style={styles.stepper}>
                <Pressable style={styles.stepButton} onPress={() => shiftHour(-1)}>
                  <Text style={styles.stepText}>−</Text>
                </Pressable>
                <Text style={styles.timeText}>{formatTime(settings.hour, settings.minute)}</Text>
                <Pressable style={styles.stepButton} onPress={() => shiftHour(1)}>
                  <Text style={styles.stepText}>+</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {logs.length > 0 && (
          <Pressable style={styles.reset} onPress={reset}>
            <Text style={styles.resetText}>Reset progress</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: space(6), paddingTop: space(8), paddingBottom: space(12) },
  eyebrow: { color: colors.accentText, fontFamily: fonts.mono, fontSize: 12, letterSpacing: 1, marginBottom: space(2) },
  title: { color: colors.ink, fontFamily: fonts.displayBold, fontSize: 28, marginBottom: space(3) },
  summary: { color: colors.muted, fontFamily: fonts.body, fontSize: 15, lineHeight: 22, marginBottom: space(7) },

  trend: {
    backgroundColor: colors.bgAlt,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space(5),
    marginBottom: space(8),
  },
  trendTitle: { color: colors.ink, fontFamily: fonts.displaySemi, fontSize: 16, marginBottom: space(4) },
  trendDots: { flexDirection: 'row', flexWrap: 'wrap', gap: space(2), marginBottom: space(4) },
  trendDot: { width: 11, height: 11, borderRadius: 6 },
  legend: { flexDirection: 'row', gap: space(5) },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: space(2) },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendText: { color: colors.muted, fontFamily: fonts.mono, fontSize: 11 },

  week: {
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.lg,
    marginBottom: space(5),
    overflow: 'hidden',
    backgroundColor: colors.bgAlt,
  },
  weekHead: { padding: space(4), borderBottomColor: colors.line, borderBottomWidth: 1 },
  weekNum: { color: colors.accentText, fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, marginBottom: space(1) },
  weekFocus: { color: colors.ink, fontFamily: fonts.bodySemi, fontSize: 15 },
  session: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: space(4),
    borderTopColor: colors.line,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: space(3),
  },
  sessionCurrent: { backgroundColor: colors.accentWash },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  dotCurrent: { borderColor: colors.accentText },
  tick: { color: colors.onAccent, fontSize: 12, fontWeight: '900' },
  sessionBody: { flex: 1 },
  rx: { color: colors.ink, fontFamily: fonts.bodyMedium, fontSize: 15 },
  rxDone: { color: colors.muted },
  meta: { color: colors.muted, fontFamily: fonts.mono, fontSize: 12, marginTop: space(1) },
  nowTag: { color: colors.accentText, fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1 },
  reset: { alignItems: 'center', paddingVertical: space(5), marginTop: space(2) },
  resetText: { color: colors.danger, fontFamily: fonts.body, fontSize: 14 },

  reminderCard: {
    backgroundColor: colors.bgAlt,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space(5),
    marginTop: space(3),
  },
  reminderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reminderTitle: { color: colors.ink, fontFamily: fonts.displaySemi, fontSize: 16 },
  reminderTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space(4),
    paddingTop: space(4),
    borderTopColor: colors.line,
    borderTopWidth: 1,
  },
  reminderTimeLabel: { color: colors.muted, fontFamily: fonts.body, fontSize: 14 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: space(3) },
  stepButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderColor: colors.lineStrong,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { color: colors.ink, fontFamily: fonts.displaySemi, fontSize: 18, lineHeight: 22 },
  timeText: { color: colors.ink, fontFamily: fonts.mono, fontSize: 15, minWidth: 76, textAlign: 'center' },
});
