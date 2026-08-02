import { Image } from 'expo-image';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { requestPermission, saveReminderSettings, scheduleDailyReminder } from '@/program/notifications';
import { colors, fonts, radius, space } from '@/theme';

function Onboarding({ onComplete }: { onComplete: (name: string) => void }) {
  const [step, setStep] = useState<'name' | 'reminders'>('name');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const trimmed = name.trim();

  async function enableReminders() {
    setBusy(true);
    const granted = await requestPermission();
    const settings = { enabled: granted, hour: 9, minute: 0 };
    await saveReminderSettings(settings);
    await scheduleDailyReminder(settings, trimmed);
    onComplete(trimmed);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <Image source={require('../../assets/images/icon.png')} style={styles.mark} contentFit="cover" />

          {step === 'name' ? (
            <>
              <Text style={styles.eyebrow}>WELCOME TO KNEERUN</Text>
              <Text style={styles.title}>Let's get you back to running.</Text>
              <Text style={styles.lede}>First, what should I call you? I'll use it to guide you through the plan.</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={colors.muted}
                autoFocus
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => trimmed && setStep('reminders')}
                maxLength={40}
              />
            </>
          ) : (
            <>
              <Text style={styles.eyebrow}>ONE LAST THING</Text>
              <Text style={styles.title}>Want a nudge each morning?</Text>
              <Text style={styles.lede}>
                A daily reminder at 9am so you don't lose the rhythm. The plan works best at 4 to 6 runs a week, and
                you can change the time or turn it off anytime.
              </Text>
            </>
          )}
        </View>

        {step === 'name' ? (
          <Pressable
            style={[styles.primary, !trimmed && styles.primaryDisabled]}
            disabled={!trimmed}
            onPress={() => setStep('reminders')}>
            <Text style={styles.primaryText}>Continue</Text>
          </Pressable>
        ) : (
          <View>
            <Pressable style={[styles.primary, busy && styles.primaryDisabled]} disabled={busy} onPress={enableReminders}>
              <Text style={styles.primaryText}>Turn on reminders</Text>
            </Pressable>
            <Pressable style={styles.ghost} disabled={busy} onPress={() => onComplete(trimmed)}>
              <Text style={styles.ghostText}>Maybe later</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1, justifyContent: 'space-between', padding: space(6), paddingBottom: space(8) },
  content: { flex: 1, justifyContent: 'center' },
  mark: { width: 68, height: 68, borderRadius: 18, marginBottom: space(8) },
  eyebrow: {
    color: colors.accentText,
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: space(3),
  },
  title: { color: colors.ink, fontFamily: fonts.displayBold, fontSize: 32, lineHeight: 38, marginBottom: space(4) },
  lede: { color: colors.muted, fontFamily: fonts.body, fontSize: 16, lineHeight: 24, marginBottom: space(7) },
  input: {
    backgroundColor: colors.bgAlt,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space(4),
    paddingVertical: space(4),
    color: colors.ink,
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
  },
  primary: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: space(4),
    alignItems: 'center',
  },
  primaryDisabled: { opacity: 0.4 },
  primaryText: { color: colors.onAccent, fontFamily: fonts.displaySemi, fontSize: 16 },
  ghost: { alignItems: 'center', paddingVertical: space(4) },
  ghostText: { color: colors.muted, fontFamily: fonts.body, fontSize: 15 },
});

export { Onboarding };
