// KneeRun brand tokens — light theme. Warm paper surfaces, signature green accent.
// The bright mint (`accent`) is for fills (buttons, dots); `accentText` is the
// deeper green used wherever the accent appears as text/labels, for contrast on light.

const colors = {
  bg: '#F6F4EE',
  bgAlt: '#FFFFFF',
  ink: '#14140F',
  muted: '#6B6960',
  accent: '#82FF80',
  accentText: '#2C7A2A',
  accentDim: '#4E8A4C',
  accentWash: 'rgba(130,255,128,0.30)',
  onAccent: '#0E2410',
  line: 'rgba(20,20,15,0.10)',
  lineStrong: 'rgba(20,20,15,0.18)',
  danger: '#C0392B',
  // How the knee felt, for the symptom trend.
  symptom: {
    good: '#2C7A2A',
    niggle: '#C98A00',
    sore: '#C0392B',
  },
};

// Brand faces, loaded via @expo-google-fonts in the root layout.
// Display: Bricolage Grotesque. Body: IBM Plex Sans. Labels/counters: IBM Plex Mono.
const fonts = {
  displaySemi: 'BricolageGrotesque_600SemiBold',
  displayBold: 'BricolageGrotesque_700Bold',
  body: 'IBMPlexSans_400Regular',
  bodyMedium: 'IBMPlexSans_500Medium',
  bodySemi: 'IBMPlexSans_600SemiBold',
  mono: 'IBMPlexMono_500Medium',
};

const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 100,
};

const space = (n: number) => n * 4;

export { colors, fonts, radius, space };
