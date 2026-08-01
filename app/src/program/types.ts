// The static plan (from data/run-program.json) plus the per-user state layered on top.

type Session = {
  reps: number;
  runMin: number;
  walkMin: number;
  warmupWalkMin?: number;
  cooldownWalkMin?: number;
};

type Week = {
  week: number;
  focus: string;
  sessions: Session[];
};

type Rule = {
  id: string;
  text: string;
};

type Program = {
  id: string;
  name: string;
  phase: string;
  summary: string;
  legend: { run: string; walk: string };
  defaults: { warmupWalkMin: number; cooldownWalkMin: number; warmupOptional: boolean };
  rules: Rule[];
  weeks: Week[];
};

// How the runner chose to move on after a session.
type Adaptation = 'advance' | 'repeat' | 'step-back';

// How the knee felt — drives the suggested adaptation.
type Symptom = 'good' | 'niggle' | 'sore';

// A completed session. The date is an ISO day string (YYYY-MM-DD).
type SessionLog = {
  week: number;
  session: number;
  date: string;
  symptom: Symptom;
  adaptation: Adaptation;
};

// A location in the plan: 1-based week and session within that week.
type SessionRef = {
  week: number;
  session: number;
};

export type {
  Session,
  Week,
  Rule,
  Program,
  Adaptation,
  Symptom,
  SessionLog,
  SessionRef,
};
