import type { MasteryState } from '../types';

const MIN_EASE = 1.3;
const INITIAL_EASE = 2.5;

export function getOrCreateMastery(questionId: string, mastery: Record<string, MasteryState>): MasteryState {
  if (mastery[questionId]) return mastery[questionId];
  return {
    questionId,
    timesSeen: 0,
    timesCorrect: 0,
    lastSeen: 0,
    nextDue: 0,
    easeFactor: INITIAL_EASE,
    status: 'new',
  };
}

export function updateMastery(state: MasteryState, correct: boolean): MasteryState {
  const now = Date.now();
  const seen = state.timesSeen + 1;
  const correctCount = state.timesCorrect + (correct ? 1 : 0);

  let ease = state.easeFactor;
  let interval: number;

  if (correct) {
    ease = Math.min(3.0, ease + 0.1);
    const baseInterval = seen <= 2 ? 1 : seen <= 4 ? 3 : 7;
    interval = Math.round(baseInterval * ease);
  } else {
    ease = Math.max(MIN_EASE, ease - 0.2);
    interval = 1;
  }

  const nextDue = now + interval * 24 * 60 * 60 * 1000;

  let status: MasteryState['status'] = 'learning';
  if (correctCount >= 5 && correctCount / seen >= 0.8) {
    status = 'mastered';
  } else if (seen >= 3) {
    status = 'review';
  }

  return {
    questionId: state.questionId,
    timesSeen: seen,
    timesCorrect: correctCount,
    lastSeen: now,
    nextDue,
    easeFactor: ease,
    status,
  };
}

export function getDueQuestionIds(mastery: Record<string, MasteryState>, limit: number): string[] {
  const now = Date.now();
  return Object.values(mastery)
    .filter(m => m.nextDue <= now && m.status !== 'mastered')
    .sort((a, b) => a.nextDue - b.nextDue)
    .slice(0, limit)
    .map(m => m.questionId);
}
