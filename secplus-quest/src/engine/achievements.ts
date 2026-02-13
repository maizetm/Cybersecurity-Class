import type { Achievement, PlayerProfile, MasteryState, RunResult } from '../types';

interface AchievementContext {
  profile: PlayerProfile;
  mastery: Record<string, MasteryState>;
  history: RunResult[];
  questionDomains: Record<string, number>;
}

export const ACHIEVEMENT_DEFS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first-blood', name: 'First Blood', description: 'Answer your first question correctly.', icon: '🩸', condition: { type: 'totalCorrect', min: 1 } },
  { id: 'ten-down', name: 'Ten Down', description: 'Get 10 correct answers.', icon: '🔟', condition: { type: 'totalCorrect', min: 10 } },
  { id: 'fifty-down', name: 'Half Century', description: 'Get 50 correct answers.', icon: '5️⃣', condition: { type: 'totalCorrect', min: 50 } },
  { id: 'century', name: 'Century', description: '100 correct answers.', icon: '💯', condition: { type: 'totalCorrect', min: 100 } },
  { id: 'streak-3', name: 'On Fire', description: '3-day streak.', icon: '🔥', condition: { type: 'streak', min: 3 } },
  { id: 'streak-7', name: 'Week Warrior', description: '7-day streak.', icon: '⚡', condition: { type: 'streak', min: 7 } },
  { id: 'streak-14', name: 'Fortnight Force', description: '14-day streak.', icon: '🌟', condition: { type: 'streak', min: 14 } },
  { id: 'streak-30', name: 'Monthly Master', description: '30-day streak.', icon: '🏆', condition: { type: 'streak', min: 30 } },
  { id: 'level-5', name: 'Rising Star', description: 'Reach level 5.', icon: '⭐', condition: { type: 'level', min: 5 } },
  { id: 'level-10', name: 'Veteran', description: 'Reach level 10.', icon: '🎖️', condition: { type: 'level', min: 10 } },
  { id: 'level-20', name: 'Elite Agent', description: 'Reach level 20.', icon: '🏅', condition: { type: 'level', min: 20 } },
  { id: 'first-run', name: 'First Mission', description: 'Complete your first run.', icon: '🎯', condition: { type: 'runsCompleted', min: 1 } },
  { id: 'ten-runs', name: 'Regular', description: 'Complete 10 runs.', icon: '🔄', condition: { type: 'runsCompleted', min: 10 } },
  { id: 'flawless-run', name: 'Flawless', description: 'Complete a run with 100% accuracy.', icon: '💎', condition: { type: 'flawlessRun' } },
  { id: 'boss-slayer', name: 'Boss Slayer', description: 'Defeat your first boss.', icon: '🐉', condition: { type: 'bossesDefeated', min: 1 } },
  { id: 'all-bosses', name: 'Domain Master', description: 'Defeat all 5 domain bosses.', icon: '👑', condition: { type: 'bossesDefeated', min: 5 } },
  { id: 'mastered-10', name: 'Knowledge Base', description: 'Master 10 questions.', icon: '📚', condition: { type: 'mastered', min: 10 } },
  { id: 'mastered-50', name: 'Scholar', description: 'Master 50 questions.', icon: '🎓', condition: { type: 'mastered', min: 50 } },
  { id: 'd1-specialist', name: 'Threat Hunter', description: '25 correct in Domain 1.', icon: '🕵️', condition: { type: 'domainCorrect', domain: 1, min: 25 } },
  { id: 'd2-specialist', name: 'Architect', description: '25 correct in Domain 2.', icon: '🏛️', condition: { type: 'domainCorrect', domain: 2, min: 25 } },
  { id: 'd3-specialist', name: 'Implementer', description: '25 correct in Domain 3.', icon: '⚙️', condition: { type: 'domainCorrect', domain: 3, min: 25 } },
  { id: 'd4-specialist', name: 'Incident Commander', description: '25 correct in Domain 4.', icon: '🚨', condition: { type: 'domainCorrect', domain: 4, min: 25 } },
  { id: 'd5-specialist', name: 'Compliance Officer', description: '25 correct in Domain 5.', icon: '📋', condition: { type: 'domainCorrect', domain: 5, min: 25 } },
  { id: 'coin-100', name: 'Penny Pincher', description: 'Earn 100 coins total.', icon: '🪙', condition: { type: 'coins', min: 100 } },
  { id: 'coin-500', name: 'Treasure Hunter', description: 'Earn 500 coins total.', icon: '💰', condition: { type: 'coins', min: 500 } },
];

function countDomainCorrect(history: RunResult[], domain: number): number {
  return history.filter(r => r.domains.includes(domain)).reduce((s, r) => s + r.correct, 0);
}

function countMastered(mastery: Record<string, MasteryState>): number {
  return Object.values(mastery).filter(m => m.status === 'mastered').length;
}

export function checkAchievements(ctx: AchievementContext): string[] {
  const newlyUnlocked: string[] = [];

  for (const def of ACHIEVEMENT_DEFS) {
    if (ctx.profile.achievementIds.includes(def.id)) continue;

    let earned = false;
    const c = def.condition;

    switch (c.type) {
      case 'totalCorrect':
        earned = ctx.profile.totalCorrect >= (c.min as number);
        break;
      case 'streak':
        earned = ctx.profile.streak >= (c.min as number);
        break;
      case 'level':
        earned = ctx.profile.level >= (c.min as number);
        break;
      case 'runsCompleted':
        earned = ctx.history.length >= (c.min as number);
        break;
      case 'flawlessRun':
        earned = ctx.history.some(r => r.correct === r.totalQuestions && r.totalQuestions >= 5);
        break;
      case 'bossesDefeated':
        earned = ctx.profile.bossesDefeated.length >= (c.min as number);
        break;
      case 'mastered':
        earned = countMastered(ctx.mastery) >= (c.min as number);
        break;
      case 'domainCorrect':
        earned = countDomainCorrect(ctx.history, c.domain as number) >= (c.min as number);
        break;
      case 'coins':
        earned = ctx.profile.coins >= (c.min as number);
        break;
    }

    if (earned) newlyUnlocked.push(def.id);
  }

  return newlyUnlocked;
}

export function getAchievement(id: string): (typeof ACHIEVEMENT_DEFS)[number] | undefined {
  return ACHIEVEMENT_DEFS.find(a => a.id === id);
}
