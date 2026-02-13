import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { PlayerProfile, MasteryState, RunResult, GameSettings, GamePage, Question } from '../types';
import { loadProfile, saveProfile, loadMastery, saveMastery, loadHistory, saveHistory, loadSettings, saveSettings, defaultProfile, defaultSettings } from './storage';
import { applyXP, updateStreak, computeXP, coinsForCorrect, shouldDropShield } from './scoring';
import { getOrCreateMastery, updateMastery, getDueQuestionIds } from './spaced-repetition';
import { checkAchievements, getAchievement } from './achievements';
import { loadQuestions, pickRandomQuestions, getQuestionById } from './questions';

interface ToastMessage {
  id: number;
  text: string;
  icon: string;
  type: 'achievement' | 'loot' | 'info' | 'xp';
}

interface GameState {
  profile: PlayerProfile;
  mastery: Record<string, MasteryState>;
  history: RunResult[];
  settings: GameSettings;
  page: GamePage;
  questions: Question[];
  loaded: boolean;
  toasts: ToastMessage[];

  // Run state
  currentRun: RunState | null;

  setPage: (p: GamePage) => void;
  startRun: (mode: 'adventure' | 'boss' | 'forge', domains: number[], count: number) => void;
  answerQuestion: (correct: boolean, xpDelta?: number, coinDelta?: number) => void;
  nextQuestion: () => void;
  endRun: () => void;
  updateSettings: (s: Partial<GameSettings>) => void;
  buyCosmetic: (id: string, cost: number) => void;
  equipCosmetic: (type: string, id: string) => void;
  dismissToast: (id: number) => void;
  getDueCards: () => Question[];
  getDomainStats: (domain: number) => { total: number; mastered: number; correct: number; seen: number };
  resetProgress: () => void;
}

interface RunState {
  mode: 'adventure' | 'boss' | 'forge' | 'timed';
  domains: number[];
  questions: Question[];
  currentIndex: number;
  correct: number;
  wrong: number;
  xpEarned: number;
  coinsEarned: number;
  lives: number;
  shields: number;
  startTime: number;
  answered: boolean;
  lastAnswerCorrect: boolean | null;
  finished: boolean;
}

const GameCtx = createContext<GameState>(null!);
export const useGame = () => useContext(GameCtx);

let toastId = 0;

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<PlayerProfile>(defaultProfile());
  const [mastery, setMastery] = useState<Record<string, MasteryState>>({});
  const [history, setHistory] = useState<RunResult[]>([]);
  const [settings, setSettings] = useState<GameSettings>(defaultSettings());
  const [page, setPage] = useState<GamePage>('home');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currentRun, setCurrentRun] = useState<RunState | null>(null);
  const profileRef = useRef(profile);
  profileRef.current = profile;

  const addToast = useCallback((text: string, icon: string, type: ToastMessage['type'] = 'info') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, text, icon, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  // Initialize
  useEffect(() => {
    async function init() {
      const p = updateStreak(loadProfile());
      setProfile(p);
      saveProfile(p);
      setMastery(loadMastery());
      setHistory(loadHistory());
      setSettings(loadSettings());
      const qs = await loadQuestions();
      setQuestions(qs);
      setLoaded(true);
    }
    init();
  }, []);

  // Persist on change
  useEffect(() => { if (loaded) saveProfile(profile); }, [profile, loaded]);
  useEffect(() => { if (loaded) saveMastery(mastery); }, [mastery, loaded]);
  useEffect(() => { if (loaded) saveHistory(history); }, [history, loaded]);
  useEffect(() => { if (loaded) saveSettings(settings); }, [settings, loaded]);

  const startRun = useCallback((mode: 'adventure' | 'boss' | 'forge', domains: number[], count: number) => {
    let runQuestions: Question[];
    if (mode === 'forge') {
      const dueIds = getDueQuestionIds(mastery, count);
      runQuestions = dueIds.map(id => getQuestionById(id)).filter(Boolean) as Question[];
      if (runQuestions.length === 0) {
        addToast('No cards due for review!', '📭', 'info');
        return;
      }
    } else {
      runQuestions = pickRandomQuestions(count, domains.length > 0 ? domains : undefined);
    }

    setCurrentRun({
      mode,
      domains,
      questions: runQuestions,
      currentIndex: 0,
      correct: 0,
      wrong: 0,
      xpEarned: 0,
      coinsEarned: 0,
      lives: mode === 'boss' ? 2 : 3,
      shields: 0,
      startTime: Date.now(),
      answered: false,
      lastAnswerCorrect: null,
      finished: false,
    });
    setPage('run');
  }, [mastery, addToast]);

  const answerQuestion = useCallback((correct: boolean, xpDelta?: number, coinDelta?: number) => {
    setCurrentRun(prev => {
      if (!prev || prev.answered) return prev;
      const q = prev.questions[prev.currentIndex];

      // XP and coins
      const xp = xpDelta ?? (correct ? computeXP(q.difficulty, profileRef.current.streak) : 0);
      const coins = coinDelta ?? (correct ? coinsForCorrect(q.difficulty) : 0);
      const shield = correct && shouldDropShield();

      // Lives
      let lives = prev.lives;
      let shields = prev.shields + (shield ? 1 : 0);
      if (!correct) {
        if (shields > 0) {
          shields--;
          addToast('Shield absorbed the hit!', '🛡️', 'info');
        } else {
          lives--;
        }
      }

      // Update mastery
      const m = getOrCreateMastery(q.id, mastery);
      const newM = updateMastery(m, correct);
      setMastery(prev => ({ ...prev, [q.id]: newM }));

      // Update profile
      setProfile(p => {
        let updated = {
          ...p,
          totalCorrect: p.totalCorrect + (correct ? 1 : 0),
          totalAnswered: p.totalAnswered + 1,
          coins: p.coins + coins,
          shields: p.shields,
        };
        updated = applyXP(updated, xp);

        // Check achievements
        const newAch = checkAchievements({ profile: updated, mastery, history, questionDomains: {} });
        if (newAch.length > 0) {
          updated = { ...updated, achievementIds: [...updated.achievementIds, ...newAch] };
          newAch.forEach(a => {
            const def = getAchievement(a);
            if (def) addToast(`Achievement: ${def.name}`, def.icon, 'achievement');
          });
        }
        return updated;
      });

      if (correct && xp > 0) {
        addToast(`+${xp} XP`, '⚡', 'xp');
      }
      if (shield) {
        addToast('Shield dropped!', '🛡️', 'loot');
      }

      const finished = lives <= 0 || prev.currentIndex >= prev.questions.length - 1;

      return {
        ...prev,
        correct: prev.correct + (correct ? 1 : 0),
        wrong: prev.wrong + (correct ? 0 : 1),
        xpEarned: prev.xpEarned + xp,
        coinsEarned: prev.coinsEarned + coins,
        lives,
        shields,
        answered: true,
        lastAnswerCorrect: correct,
        finished,
      };
    });
  }, [mastery, history, addToast]);

  const nextQuestion = useCallback(() => {
    setCurrentRun(prev => {
      if (!prev) return null;
      if (prev.finished) return prev;
      return {
        ...prev,
        currentIndex: prev.currentIndex + 1,
        answered: false,
        lastAnswerCorrect: null,
      };
    });
  }, []);

  const endRun = useCallback(() => {
    if (!currentRun) return;

    const result: RunResult = {
      id: `run-${Date.now()}`,
      mode: currentRun.mode,
      domains: currentRun.domains,
      totalQuestions: currentRun.questions.length,
      correct: currentRun.correct,
      wrong: currentRun.wrong,
      xpEarned: currentRun.xpEarned,
      coinsEarned: currentRun.coinsEarned,
      timestamp: Date.now(),
      lootDrops: [],
      duration: Date.now() - currentRun.startTime,
    };

    // Boss defeat tracking
    if (currentRun.mode === 'boss' && currentRun.correct > currentRun.wrong) {
      const bossDomain = currentRun.domains[0];
      if (bossDomain && !profile.bossesDefeated.includes(bossDomain)) {
        setProfile(p => ({ ...p, bossesDefeated: [...p.bossesDefeated, bossDomain] }));
        addToast(`Boss defeated: Domain ${bossDomain}!`, '🐉', 'achievement');
      }
    }

    setHistory(prev => [...prev, result]);
    setCurrentRun(null);
    setPage('run-results');
  }, [currentRun, profile.bossesDefeated, addToast]);

  const updateSettingsFn = useCallback((s: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...s }));
  }, []);

  const buyCosmetic = useCallback((id: string, cost: number) => {
    setProfile(p => {
      if (p.coins < cost || p.unlockedCosmeticIds.includes(id)) return p;
      return {
        ...p,
        coins: p.coins - cost,
        unlockedCosmeticIds: [...p.unlockedCosmeticIds, id],
      };
    });
  }, []);

  const equipCosmetic = useCallback((type: string, id: string) => {
    setProfile(p => ({
      ...p,
      equippedCosmetics: { ...p.equippedCosmetics, [type]: id },
    }));
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const getDueCards = useCallback((): Question[] => {
    const dueIds = getDueQuestionIds(mastery, settings.forgeSize);
    return dueIds.map(id => getQuestionById(id)).filter(Boolean) as Question[];
  }, [mastery, settings.forgeSize]);

  const getDomainStats = useCallback((domain: number) => {
    const domainQs = questions.filter(q => q.domain === domain);
    const masteredCount = domainQs.filter(q => mastery[q.id]?.status === 'mastered').length;
    const seenCount = domainQs.filter(q => mastery[q.id]?.timesSeen > 0).length;
    const correctCount = domainQs.reduce((s, q) => s + (mastery[q.id]?.timesCorrect ?? 0), 0);
    return { total: domainQs.length, mastered: masteredCount, correct: correctCount, seen: seenCount };
  }, [questions, mastery]);

  const resetProgress = useCallback(() => {
    const fresh = defaultProfile();
    setProfile(fresh);
    setMastery({});
    setHistory([]);
    setCurrentRun(null);
    setPage('home');
  }, []);

  return (
    <GameCtx.Provider value={{
      profile, mastery, history, settings, page, questions, loaded, toasts, currentRun,
      setPage, startRun, answerQuestion, nextQuestion, endRun,
      updateSettings: updateSettingsFn, buyCosmetic, equipCosmetic, dismissToast,
      getDueCards, getDomainStats, resetProgress,
    }}>
      {children}
    </GameCtx.Provider>
  );
}
