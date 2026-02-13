import type { Question, QuestionPack } from '../types';

let questionDeck: Question[] = [];

export async function loadQuestions(): Promise<Question[]> {
  if (questionDeck.length > 0) return questionDeck;

  const packFiles = ['core.json'];
  const allQuestions: Question[] = [];

  for (const file of packFiles) {
    try {
      const resp = await fetch(`./questions/${file}`);
      if (!resp.ok) continue;
      const pack: QuestionPack = await resp.json();
      allQuestions.push(...pack.questions);
    } catch {
      console.warn(`Failed to load question pack: ${file}`);
    }
  }

  questionDeck = allQuestions;
  return questionDeck;
}

export function getQuestionsByDomain(domain: number): Question[] {
  return questionDeck.filter(q => q.domain === domain);
}

export function getQuestionById(id: string): Question | undefined {
  return questionDeck.find(q => q.id === id);
}

export function pickRandomQuestions(count: number, domains?: number[], exclude?: Set<string>): Question[] {
  let pool = [...questionDeck];
  if (domains && domains.length > 0) {
    pool = pool.filter(q => domains.includes(q.domain));
  }
  if (exclude) {
    pool = pool.filter(q => !exclude.has(q.id));
  }
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
