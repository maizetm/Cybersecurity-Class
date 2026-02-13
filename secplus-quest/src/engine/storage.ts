import type { PlayerProfile, MasteryState, RunResult, GameSettings, Cosmetic } from '../types';

const KEYS = {
  profile: 'secplus_profile',
  mastery: 'secplus_mastery',
  history: 'secplus_history',
  settings: 'secplus_settings',
};

// ─── Defaults ───

export function defaultProfile(): PlayerProfile {
  return {
    name: 'Agent',
    level: 1,
    xp: 0,
    xpToNext: 100,
    coins: 0,
    streak: 0,
    lastActiveDate: '',
    totalCorrect: 0,
    totalAnswered: 0,
    shields: 0,
    equippedCosmetics: {},
    unlockedCosmeticIds: [],
    achievementIds: [],
    bossesDefeated: [],
  };
}

export function defaultSettings(): GameSettings {
  return { soundEnabled: true, reducedMotion: false, forgeSize: 10 };
}

// ─── Read ───

export function loadProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(KEYS.profile);
    if (raw) return { ...defaultProfile(), ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaultProfile();
}

export function loadMastery(): Record<string, MasteryState> {
  try {
    const raw = localStorage.getItem(KEYS.mastery);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

export function loadHistory(): RunResult[] {
  try {
    const raw = localStorage.getItem(KEYS.history);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(KEYS.settings);
    if (raw) return { ...defaultSettings(), ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaultSettings();
}

// ─── Write ───

export function saveProfile(p: PlayerProfile) {
  localStorage.setItem(KEYS.profile, JSON.stringify(p));
}
export function saveMastery(m: Record<string, MasteryState>) {
  localStorage.setItem(KEYS.mastery, JSON.stringify(m));
}
export function saveHistory(h: RunResult[]) {
  localStorage.setItem(KEYS.history, JSON.stringify(h.slice(-50)));
}
export function saveSettings(s: GameSettings) {
  localStorage.setItem(KEYS.settings, JSON.stringify(s));
}

// ─── Export / Import ───

export function exportAll(): string {
  return JSON.stringify({
    profile: loadProfile(),
    mastery: loadMastery(),
    history: loadHistory(),
    settings: loadSettings(),
  }, null, 2);
}

export function importAll(json: string) {
  const data = JSON.parse(json);
  if (data.profile) saveProfile(data.profile);
  if (data.mastery) saveMastery(data.mastery);
  if (data.history) saveHistory(data.history);
  if (data.settings) saveSettings(data.settings);
}

export function resetAll() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}

// ─── Cosmetics catalog ───

export const ALL_COSMETICS: Cosmetic[] = [
  { id: 'hat-hacker', name: 'Hacker Hood', type: 'hat', description: 'A dark hoodie befitting a white-hat.', cost: 50, icon: '🧥', unlocked: false },
  { id: 'hat-shield', name: 'Shield Helm', type: 'hat', description: 'Armor for your avatar.', cost: 100, icon: '🛡️', unlocked: false },
  { id: 'hat-crown', name: 'Cyber Crown', type: 'hat', description: 'For the Security+ royalty.', cost: 200, icon: '👑', unlocked: false },
  { id: 'frame-fire', name: 'Fire Frame', type: 'frame', description: 'A blazing border.', cost: 75, icon: '🔥', unlocked: false },
  { id: 'frame-ice', name: 'Ice Frame', type: 'frame', description: 'Cool and collected.', cost: 75, icon: '❄️', unlocked: false },
  { id: 'frame-matrix', name: 'Matrix Frame', type: 'frame', description: 'Green rain aesthetic.', cost: 150, icon: '💚', unlocked: false },
  { id: 'theme-midnight', name: 'Midnight Theme', type: 'theme', description: 'Even darker mode.', cost: 100, icon: '🌙', unlocked: false },
  { id: 'theme-neon', name: 'Neon Theme', type: 'theme', description: 'Bright neon accents.', cost: 100, icon: '💡', unlocked: false },
  { id: 'badge-firstblood', name: 'First Blood', type: 'badge', description: 'Your first correct answer.', cost: 0, icon: '🩸', unlocked: false },
  { id: 'badge-streaker', name: 'Streaker', type: 'badge', description: '7-day streak.', cost: 0, icon: '🔥', unlocked: false },
];
