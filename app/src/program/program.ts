import raw from '@/data/run-program.json';

import type { Adaptation, Program, Session, SessionLog, SessionRef, Symptom } from './types';

const program: Program = raw as Program;

function getProgram(): Program {
  return program;
}

function getWeek(week: number) {
  return program.weeks.find((w) => w.week === week);
}

function getSession(ref: SessionRef): Session | undefined {
  return getWeek(ref.week)?.sessions[ref.session - 1];
}

function totalSessions(): number {
  return program.weeks.reduce((sum, w) => sum + w.sessions.length, 0);
}

// The true training load: minutes actually spent running.
function runningMinutes(session: Session): number {
  return session.reps * session.runMin;
}

// Wall-clock length of the outing, including any warm-up/cool-down walk.
function totalMinutes(session: Session): number {
  const intervals = session.reps * (session.runMin + session.walkMin);
  const bookends = (session.warmupWalkMin ?? 0) + (session.cooldownWalkMin ?? 0);
  return intervals + bookends;
}

function isContinuousRun(session: Session): boolean {
  return session.walkMin === 0 && session.reps === 1;
}

// Human-readable prescription, e.g. "3× (1′ run / 1′ walk)".
function prescription(session: Session): string {
  if (isContinuousRun(session)) {
    return `${session.runMin}′ continuous run`;
  }
  const core = `${session.reps}× (${session.runMin}′ run / ${session.walkMin}′ walk)`;
  if (session.warmupWalkMin) {
    return `${session.warmupWalkMin}′ walk + ${core} + ${session.cooldownWalkMin ?? session.warmupWalkMin}′ walk`;
  }
  return core;
}

// Walk one step forward through the plan; undefined once the program is finished.
function nextRef(ref: SessionRef): SessionRef | undefined {
  const week = getWeek(ref.week);
  if (!week) return undefined;
  if (ref.session < week.sessions.length) {
    return { week: ref.week, session: ref.session + 1 };
  }
  const following = getWeek(ref.week + 1);
  return following ? { week: following.week, session: 1 } : undefined;
}

// Walk one step back; clamped at the very first session.
function previousRef(ref: SessionRef): SessionRef {
  if (ref.session > 1) {
    return { week: ref.week, session: ref.session - 1 };
  }
  const prior = getWeek(ref.week - 1);
  if (!prior) return { week: 1, session: 1 };
  return { week: prior.week, session: prior.sessions.length };
}

// Where the runner should go after finishing `ref` with the given choice.
function refAfter(ref: SessionRef, adaptation: Adaptation): SessionRef | undefined {
  switch (adaptation) {
    case 'advance':
      return nextRef(ref);
    case 'repeat':
      return ref;
    case 'step-back':
      return previousRef(ref);
  }
}

// The session the runner should do next, derived purely from their logs.
// Undefined means the whole program is complete.
function currentRef(logs: SessionLog[]): SessionRef | undefined {
  if (logs.length === 0) return { week: 1, session: 1 };
  const last = logs[logs.length - 1];
  return refAfter({ week: last.week, session: last.session }, last.adaptation);
}

// Which adaptation to suggest based on how the knee felt.
function suggestedAdaptation(symptom: Symptom): Adaptation {
  switch (symptom) {
    case 'good':
      return 'advance';
    case 'niggle':
      return 'repeat';
    case 'sore':
      return 'step-back';
  }
}

function isDone(logs: SessionLog[], ref: SessionRef): boolean {
  return logs.some((log) => log.week === ref.week && log.session === ref.session);
}

export {
  getProgram,
  getWeek,
  getSession,
  totalSessions,
  runningMinutes,
  totalMinutes,
  isContinuousRun,
  prescription,
  nextRef,
  previousRef,
  refAfter,
  currentRef,
  suggestedAdaptation,
  isDone,
};
