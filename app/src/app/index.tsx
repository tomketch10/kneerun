import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  currentRef,
  getSession,
  getWeek,
  prescription,
  runningMinutes,
  suggestedAdaptation,
  totalMinutes,
  totalSessions,
} from '@/program/program';
import { useLogs } from '@/program/storage';
import type { Adaptation, Symptom } from '@/program/types';
import { colors, radius, space } from '@/theme';

const NUDGES = [
  "Small run today. Lace up, your knee's ready for this one.",
  'Easy pace, that’s the whole game. Slow is exactly right.',
  'You’ve done harder. Get out the door and let the plan do the rest.',
  'One session closer to running free. Go get it.',
  'Nothing to prove today. Just tick the box and come home.',
];

const SYMPTOMS: { key: Symptom; label: string; sub: string }[] = [
  { key: 'good', label: 'Felt good', sub: 'No pain, knee handled it' },
  { key: 'niggle', label: 'A little niggle', sub: 'Aware of it, nothing sharp' },
  { key: 'sore', label: 'Sore', sub: 'Painful or swollen after' },
];

const ADAPTATION_COPY: Record<Adaptation, { title: string; body: string }> = {
  advance: { title: 'Move on to the next session', body: 'The knee’s coping well. Step up next time.' },
  repeat: { title: 'Repeat this session next time', body: 'Bank it again before you progress. No rush.' },
  'step-back': { title: 'Drop back a session', body: 'Ease off and let it settle. Backing off now keeps you running later.' },
};

export default function TodayScreen() {
  const { logs, loading, append } = useLogs();
  const [checkingIn, setCheckingIn] = useState(false);
  const [symptom, setSymptom] = useState<Symptom | null>(null);

  const ref = useMemo(() => currentRef(logs), [logs]);
  const nudge = NUDGES[logs.length % NUDGES.length];

  function reset() {
    setCheckingIn(false);
    setSymptom(null);
  }

  function confirm(adaptation: Adaptation) {
    if (!ref || !symptom) return;
    const now = new Date();
    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    append({ week: ref.week, session: ref.session, date, symptom, adaptation });
    reset();
  }

  if (loading) {
    return (
      <Screen>
        <Text style={styles.muted}>Loading…</Text>
      </Screen>
    );
  }

  if (!ref) {
    return (
      <Screen>
        <Text style={styles.eyebrow}>PROGRAM COMPLETE</Text>
        <Text style={styles.done}>You did it.</Text>
        <Text style={styles.lede}>
          Eight weeks, {logs.length} sessions, and you’re running 30 minutes straight. That’s a full return to
          running after ACL surgery. Take a moment. This was the hard part.
        </Text>
      </Screen>
    );
  }

  const week = getWeek(ref.week);
  const session = getSession(ref);
  if (!week || !session) {
    return (
      <Screen>
        <Text style={styles.muted}>Something’s off with the plan data.</Text>
      </Screen>
    );
  }
  const suggestion = symptom ? suggestedAdaptation(symptom) : null;

  return (
    <Screen>
      <Text style={styles.eyebrow}>
        WEEK {ref.week} · SESSION {ref.session} OF {week.sessions.length}
      </Text>
      <Text style={styles.focus}>{week.focus}</Text>

      <View style={styles.card}>
        <Text style={styles.rx}>{prescription(session)}</Text>
        <Text style={styles.meta}>
          {runningMinutes(session)}′ running · ~{totalMinutes(session)}′ total
        </Text>
      </View>

      {!checkingIn && (
        <>
          <Text style={styles.nudge}>{nudge}</Text>
          <Pressable style={styles.primary} onPress={() => setCheckingIn(true)}>
            <Text style={styles.primaryText}>Mark done</Text>
          </Pressable>
          <Text style={styles.progressNote}>
            {logs.length} of {totalSessions()} sessions logged
          </Text>
        </>
      )}

      {checkingIn && !symptom && (
        <View style={styles.checkin}>
          <Text style={styles.checkinTitle}>How did the knee feel?</Text>
          {SYMPTOMS.map((s) => (
            <Pressable key={s.key} style={styles.option} onPress={() => setSymptom(s.key)}>
              <Text style={styles.optionLabel}>{s.label}</Text>
              <Text style={styles.optionSub}>{s.sub}</Text>
            </Pressable>
          ))}
          <Pressable style={styles.cancel} onPress={reset}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {checkingIn && symptom && suggestion && (
        <View style={styles.checkin}>
          <Text style={styles.checkinTitle}>{ADAPTATION_COPY[suggestion].title}</Text>
          <Text style={styles.checkinBody}>{ADAPTATION_COPY[suggestion].body}</Text>
          <Pressable style={styles.primary} onPress={() => confirm(suggestion)}>
            <Text style={styles.primaryText}>Sounds right</Text>
          </Pressable>
          <Pressable style={styles.cancel} onPress={() => setSymptom(null)}>
            <Text style={styles.cancelText}>Back</Text>
          </Pressable>
        </View>
      )}
    </Screen>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>{children}</ScrollView>
    </SafeAreaView>
  );
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: space(6), paddingTop: space(8) },
  eyebrow: {
    color: colors.accentText,
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: space(3),
  },
  focus: { color: colors.ink, fontSize: 26, fontWeight: '700', lineHeight: 32, marginBottom: space(6) },
  card: {
    backgroundColor: colors.bgAlt,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space(6),
    marginBottom: space(6),
  },
  rx: { color: colors.ink, fontSize: 22, fontWeight: '600', marginBottom: space(2) },
  meta: { color: colors.muted, fontSize: 13 },
  nudge: { color: colors.ink, fontSize: 16, lineHeight: 24, marginBottom: space(6) },
  primary: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: space(4),
    alignItems: 'center',
  },
  primaryText: { color: colors.onAccent, fontSize: 16, fontWeight: '700' },
  progressNote: { color: colors.muted, fontSize: 13, textAlign: 'center', marginTop: space(4) },
  checkin: { marginTop: space(2) },
  checkinTitle: { color: colors.ink, fontSize: 20, fontWeight: '700', marginBottom: space(2) },
  checkinBody: { color: colors.muted, fontSize: 15, lineHeight: 22, marginBottom: space(6) },
  option: {
    backgroundColor: colors.bgAlt,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space(4),
    marginBottom: space(3),
  },
  optionLabel: { color: colors.ink, fontSize: 16, fontWeight: '600' },
  optionSub: { color: colors.muted, fontSize: 13, marginTop: space(1) },
  cancel: { alignItems: 'center', paddingVertical: space(4) },
  cancelText: { color: colors.muted, fontSize: 14 },
  muted: { color: colors.muted, fontSize: 15 },
  done: { color: colors.ink, fontSize: 34, fontWeight: '700', marginBottom: space(4) },
  lede: { color: colors.muted, fontSize: 16, lineHeight: 24 },
});
