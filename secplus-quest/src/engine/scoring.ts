import type { Question, PlayerProfile } from '../types';

export function baseXP(difficulty: Question['difficulty']): number {
  switch (difficulty) {
    case 'easy': return 10;
    case 'medium': return 20;
    case 'hard': return 35;
  }
}

export function streakMultiplier(streak: number): number {
  return Math.min(1.5, 1.0 + streak * 0.05);
}

export function computeXP(difficulty: Question['difficulty'], streak: number, timeBonus: number = 0): number {
  const base = baseXP(difficulty);
  const mult = streakMultiplier(streak);
  return Math.round((base + timeBonus) * mult);
}

export function coinsForCorrect(difficulty: Question['difficulty']): number {
  const base = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 3 : 5;
  const bonus = Math.random() < 0.1 ? Math.floor(Math.random() * 3) + 1 : 0;
  return base + bonus;
}

export function shouldDropShield(): boolean {
  return Math.random() < 0.15;
}

export function xpToNextLevel(level: number): number {
  return Math.round(100 * Math.pow(1.15, level - 1));
}

export function applyXP(profile: PlayerProfile, xp: number): PlayerProfile {
  let newXP = profile.xp + xp;
  let newLevel = profile.level;
  let newXPToNext = profile.xpToNext;
  while (newXP >= newXPToNext) {
    newXP -= newXPToNext;
    newLevel++;
    newXPToNext = xpToNextLevel(newLevel);
  }
  return { ...profile, xp: newXP, level: newLevel, xpToNext: newXPToNext };
}

export function updateStreak(profile: PlayerProfile): PlayerProfile {
  const today = new Date().toISOString().split('T')[0];
  if (profile.lastActiveDate === today) return profile;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const newStreak = profile.lastActiveDate === yesterday ? profile.streak + 1 : 1;
  return { ...profile, streak: newStreak, lastActiveDate: today };
}

export function lootDropCount(correct: number, total: number): number {
  const ratio = correct / Math.max(total, 1);
  if (ratio >= 0.9) return 2;
  if (ratio >= 0.7) return 1;
  return Math.random() < 0.3 ? 1 : 0;
}
