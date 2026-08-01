import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  currentRef,
  getProgram,
  isDone,
  prescription,
  runningMinutes,
} from '@/program/program';
import { useLogs } from '@/program/storage';
import { colors, radius, space } from '@/theme';

export default function PlanScreen() {
  const { logs, loading, reset } = useLogs();
  const program = getProgram();
  const current = useMemo(() => currentRef(logs), [logs]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyebrow}>PHASE 03 · RUN</Text>
        <Text style={styles.title}>{program.name}</Text>
        <Text style={styles.summary}>{program.summary}</Text>

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
                <View
                  key={index}
                  style={[styles.session, isCurrent && styles.sessionCurrent]}>
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
  eyebrow: { color: colors.accentText, fontSize: 12, letterSpacing: 1, fontWeight: '600', marginBottom: space(2) },
  title: { color: colors.ink, fontSize: 28, fontWeight: '700', marginBottom: space(3) },
  summary: { color: colors.muted, fontSize: 15, lineHeight: 22, marginBottom: space(8) },
  week: {
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.lg,
    marginBottom: space(5),
    overflow: 'hidden',
    backgroundColor: colors.bgAlt,
  },
  weekHead: { padding: space(4), borderBottomColor: colors.line, borderBottomWidth: 1 },
  weekNum: { color: colors.accentText, fontSize: 11, letterSpacing: 1, fontWeight: '600', marginBottom: space(1) },
  weekFocus: { color: colors.ink, fontSize: 15, fontWeight: '600' },
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
  rx: { color: colors.ink, fontSize: 15, fontWeight: '500' },
  rxDone: { color: colors.muted },
  meta: { color: colors.muted, fontSize: 12, marginTop: space(1) },
  nowTag: { color: colors.accentText, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  reset: { alignItems: 'center', paddingVertical: space(5), marginTop: space(2) },
  resetText: { color: colors.danger, fontSize: 14 },
});
