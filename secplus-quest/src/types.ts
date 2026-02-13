// ─── Question types ───

export interface ScenarioChoice {
  label: string;
  nextId?: string;
  outcome?: 'win' | 'lose' | 'continue';
  feedback: string;
  delta?: { xp?: number; coins?: number; shields?: number };
}

export interface ScenarioNode {
  id: string;
  text: string;
  choices: ScenarioChoice[];
}

export interface BaseQuestion {
  id: string;
  domain: 1 | 2 | 3 | 4 | 5;
  objectives: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  explanation: string;
  references?: string[];
  mnemonic?: string;
}

export interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  choices: string[];
  answerIndex: number;
}

export interface MultiQuestion extends BaseQuestion {
  type: 'multi';
  choices: string[];
  answerIndices: number[];
  selectCountHint?: number;
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  left: string[];
  right: string[];
  pairs: number[];
}

export interface OrderingQuestion extends BaseQuestion {
  type: 'ordering';
  steps: string[];
  correctOrder: number[];
}

export interface ScenarioQuestion extends BaseQuestion {
  type: 'scenario';
  startNodeId: string;
  nodes: ScenarioNode[];
}

export type Question = MCQQuestion | MultiQuestion | MatchingQuestion | OrderingQuestion | ScenarioQuestion;

export interface QuestionPack {
  packId: string;
  title: string;
  version: string;
  createdAt: string;
  questions: Question[];
}

// ─── Mastery / Spaced Repetition ───

export interface MasteryState {
  questionId: string;
  timesSeen: number;
  timesCorrect: number;
  lastSeen: number;
  nextDue: number;
  easeFactor: number;
  status: 'new' | 'learning' | 'review' | 'mastered';
}

// ─── Player ───

export interface Cosmetic {
  id: string;
  name: string;
  type: 'hat' | 'frame' | 'theme' | 'badge';
  description: string;
  cost: number;
  icon: string;
  unlocked: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  condition: AchievementCondition;
}

export interface AchievementCondition {
  type: string;
  [key: string]: unknown;
}

export interface PlayerProfile {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  coins: number;
  streak: number;
  lastActiveDate: string;
  totalCorrect: number;
  totalAnswered: number;
  shields: number;
  equippedCosmetics: Record<string, string>;
  unlockedCosmeticIds: string[];
  achievementIds: string[];
  bossesDefeated: number[];
}

// ─── Run ───

export interface RunResult {
  id: string;
  mode: 'adventure' | 'boss' | 'timed' | 'forge';
  domains: number[];
  totalQuestions: number;
  correct: number;
  wrong: number;
  xpEarned: number;
  coinsEarned: number;
  timestamp: number;
  lootDrops: string[];
  duration: number;
}

// ─── Game State ───

export type GamePage = 'home' | 'map' | 'run-setup' | 'run' | 'boss-setup' | 'boss' | 'forge' | 'collection' | 'shop' | 'settings' | 'mini-ports' | 'run-results';

export interface GameSettings {
  soundEnabled: boolean;
  reducedMotion: boolean;
  forgeSize: number;
}

export const DOMAIN_NAMES: Record<number, string> = {
  1: 'Attacks, Threats & Vulnerabilities',
  2: 'Architecture & Design',
  3: 'Implementation',
  4: 'Operations & Incident Response',
  5: 'Governance, Risk & Compliance',
};

export const DOMAIN_BIOMES: Record<number, { name: string; color: string; icon: string }> = {
  1: { name: 'Haunted Network', color: 'var(--color-domain-1)', icon: '👻' },
  2: { name: 'Sci-Fi Facility', color: 'var(--color-domain-2)', icon: '🏗️' },
  3: { name: 'Cyber Workshop', color: 'var(--color-domain-3)', icon: '🔧' },
  4: { name: 'Command Center', color: 'var(--color-domain-4)', icon: '🎯' },
  5: { name: 'Courthouse Vault', color: 'var(--color-domain-5)', icon: '⚖️' },
};
