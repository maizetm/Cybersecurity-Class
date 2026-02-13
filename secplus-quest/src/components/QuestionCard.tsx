import { useState, useMemo } from 'react';
import type { Question, MCQQuestion, MultiQuestion, MatchingQuestion, OrderingQuestion, ScenarioQuestion } from '../types';
import { DOMAIN_BIOMES } from '../types';
import { shuffleArray } from '../engine/questions';

interface Props {
  question: Question;
  answered: boolean;
  onAnswer: (correct: boolean) => void;
}

export default function QuestionCard({ question, answered, onAnswer }: Props) {
  const biome = DOMAIN_BIOMES[question.domain];
  const diffColor = question.difficulty === 'easy' ? 'text-green-400' : question.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="animate-fade-in bg-cyber-panel border border-cyber-border rounded-xl p-6 max-w-2xl w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 text-xs">
        <span className="px-2 py-0.5 rounded-full border" style={{ borderColor: biome.color, color: biome.color }}>
          {biome.icon} {biome.name}
        </span>
        <span className={`${diffColor} uppercase font-bold`}>{question.difficulty}</span>
      </div>

      {/* Prompt */}
      <p className="text-lg mb-6 leading-relaxed">{question.prompt}</p>

      {/* Type-specific renderer */}
      {question.type === 'mcq' && <MCQRenderer q={question} answered={answered} onAnswer={onAnswer} />}
      {question.type === 'multi' && <MultiRenderer q={question} answered={answered} onAnswer={onAnswer} />}
      {question.type === 'matching' && <MatchingRenderer q={question} answered={answered} onAnswer={onAnswer} />}
      {question.type === 'ordering' && <OrderingRenderer q={question} answered={answered} onAnswer={onAnswer} />}
      {question.type === 'scenario' && <ScenarioRenderer q={question} answered={answered} onAnswer={onAnswer} />}

      {/* Explanation */}
      {answered && (
        <div className="mt-4 p-4 bg-cyber-darker rounded-lg border border-cyber-border animate-fade-in">
          <p className="text-sm text-gray-300"><span className="text-cyber-blue font-bold">Explanation:</span> {question.explanation}</p>
          {question.mnemonic && <p className="text-sm text-cyber-purple mt-1">💡 {question.mnemonic}</p>}
        </div>
      )}
    </div>
  );
}

// ─── MCQ ───

function MCQRenderer({ q, answered, onAnswer }: { q: MCQQuestion; answered: boolean; onAnswer: (c: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
    onAnswer(i === q.answerIndex);
  };

  return (
    <div className="flex flex-col gap-2">
      {q.choices.map((c, i) => {
        let cls = 'border-cyber-border hover:border-cyber-blue/50';
        if (answered) {
          if (i === q.answerIndex) cls = 'border-green-500 bg-green-500/10';
          else if (i === selected) cls = 'border-red-500 bg-red-500/10';
        } else if (i === selected) {
          cls = 'border-cyber-blue bg-cyber-blue/10';
        }
        return (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={answered}
            className={`text-left px-4 py-3 rounded-lg border transition-colors cursor-pointer disabled:cursor-default ${cls}`}
          >
            <span className="text-gray-400 mr-2 font-mono text-sm">{String.fromCharCode(65 + i)}.</span>
            {c}
          </button>
        );
      })}
    </div>
  );
}

// ─── Multi-select ───

function MultiRenderer({ q, answered, onAnswer }: { q: MultiQuestion; answered: boolean; onAnswer: (c: boolean) => void }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggleChoice = (i: number) => {
    if (answered) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const submit = () => {
    if (submitted) return;
    setSubmitted(true);
    const correct = q.answerIndices.length === selected.size &&
      q.answerIndices.every(i => selected.has(i));
    onAnswer(correct);
  };

  return (
    <div className="flex flex-col gap-2">
      {q.selectCountHint && <p className="text-xs text-gray-400 mb-1">Select {q.selectCountHint} answers</p>}
      {q.choices.map((c, i) => {
        let cls = 'border-cyber-border hover:border-cyber-blue/50';
        if (answered) {
          if (q.answerIndices.includes(i)) cls = 'border-green-500 bg-green-500/10';
          else if (selected.has(i)) cls = 'border-red-500 bg-red-500/10';
        } else if (selected.has(i)) {
          cls = 'border-cyber-blue bg-cyber-blue/10';
        }
        return (
          <button
            key={i}
            onClick={() => toggleChoice(i)}
            disabled={answered}
            className={`text-left px-4 py-3 rounded-lg border transition-colors cursor-pointer disabled:cursor-default flex items-center gap-2 ${cls}`}
          >
            <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-xs
              ${selected.has(i) ? 'bg-cyber-blue border-cyber-blue' : 'border-gray-500'}`}>
              {selected.has(i) && '✓'}
            </span>
            {c}
          </button>
        );
      })}
      {!answered && (
        <button
          onClick={submit}
          disabled={selected.size === 0}
          className="mt-2 px-6 py-2 bg-cyber-blue text-black font-bold rounded-lg disabled:opacity-50 cursor-pointer disabled:cursor-default hover:bg-cyber-blue/80 transition-colors"
        >
          Submit
        </button>
      )}
    </div>
  );
}

// ─── Matching ───

function MatchingRenderer({ q, answered, onAnswer }: { q: MatchingQuestion; answered: boolean; onAnswer: (c: boolean) => void }) {
  const shuffledRight = useMemo(() => {
    const indices = q.right.map((_, i) => i);
    return shuffleArray(indices);
  }, [q.right]);

  const [matches, setMatches] = useState<(number | null)[]>(new Array(q.left.length).fill(null));
  const [activeLeft, setActiveLeft] = useState<number | null>(null);

  const selectLeft = (i: number) => {
    if (answered) return;
    setActiveLeft(i);
  };

  const selectRight = (rightOrigIdx: number) => {
    if (answered || activeLeft === null) return;
    setMatches(prev => {
      const next = [...prev];
      next[activeLeft] = rightOrigIdx;
      return next;
    });
    setActiveLeft(null);
  };

  const submit = () => {
    if (matches.includes(null)) return;
    const correct = q.pairs.every((p, i) => matches[i] === p);
    onAnswer(correct);
  };

  return (
    <div>
      <p className="text-xs text-gray-400 mb-3">Click a left item, then click its match on the right.</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          {q.left.map((item, i) => (
            <button
              key={i}
              onClick={() => selectLeft(i)}
              disabled={answered}
              className={`text-left px-3 py-2 rounded-lg border transition-colors cursor-pointer disabled:cursor-default text-sm
                ${activeLeft === i ? 'border-cyber-blue bg-cyber-blue/10' :
                  matches[i] !== null ? 'border-cyber-green/50 bg-cyber-green/5' : 'border-cyber-border'
                }
                ${answered && q.pairs[i] === matches[i] ? 'border-green-500 bg-green-500/10' :
                  answered && q.pairs[i] !== matches[i] ? 'border-red-500 bg-red-500/10' : ''
                }`}
            >
              {item}
              {matches[i] !== null && <span className="text-xs text-cyber-green ml-2">→ {q.right[matches[i]!]}</span>}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {shuffledRight.map((origIdx) => (
            <button
              key={origIdx}
              onClick={() => selectRight(origIdx)}
              disabled={answered}
              className={`text-left px-3 py-2 rounded-lg border border-cyber-border transition-colors cursor-pointer disabled:cursor-default text-sm hover:border-cyber-blue/50
                ${Object.values(matches).includes(origIdx) ? 'opacity-50' : ''}`}
            >
              {q.right[origIdx]}
            </button>
          ))}
        </div>
      </div>
      {!answered && (
        <button
          onClick={submit}
          disabled={matches.includes(null)}
          className="mt-4 px-6 py-2 bg-cyber-blue text-black font-bold rounded-lg disabled:opacity-50 cursor-pointer disabled:cursor-default hover:bg-cyber-blue/80 transition-colors"
        >
          Submit
        </button>
      )}
    </div>
  );
}

// ─── Ordering ───

function OrderingRenderer({ q, answered, onAnswer }: { q: OrderingQuestion; answered: boolean; onAnswer: (c: boolean) => void }) {
  const shuffledIndices = useMemo(() => shuffleArray(q.correctOrder), [q.correctOrder]);
  const [order, setOrder] = useState<number[]>(shuffledIndices);

  const moveUp = (pos: number) => {
    if (answered || pos === 0) return;
    setOrder(prev => {
      const next = [...prev];
      [next[pos], next[pos - 1]] = [next[pos - 1], next[pos]];
      return next;
    });
  };

  const moveDown = (pos: number) => {
    if (answered || pos === order.length - 1) return;
    setOrder(prev => {
      const next = [...prev];
      [next[pos], next[pos + 1]] = [next[pos + 1], next[pos]];
      return next;
    });
  };

  const submit = () => {
    const correct = order.every((v, i) => v === q.correctOrder[i]);
    onAnswer(correct);
  };

  return (
    <div>
      <p className="text-xs text-gray-400 mb-3">Drag or use arrows to reorder.</p>
      <div className="flex flex-col gap-2">
        {order.map((stepIdx, pos) => (
          <div
            key={stepIdx}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm
              ${answered && q.correctOrder[pos] === stepIdx ? 'border-green-500 bg-green-500/10' :
                answered ? 'border-red-500 bg-red-500/10' : 'border-cyber-border'}`}
          >
            <span className="text-gray-500 font-mono w-6">{pos + 1}.</span>
            <span className="flex-1">{q.steps[stepIdx]}</span>
            {!answered && (
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveUp(pos)} disabled={pos === 0} className="text-xs text-gray-400 hover:text-white cursor-pointer disabled:opacity-30">▲</button>
                <button onClick={() => moveDown(pos)} disabled={pos === order.length - 1} className="text-xs text-gray-400 hover:text-white cursor-pointer disabled:opacity-30">▼</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {!answered && (
        <button
          onClick={submit}
          className="mt-4 px-6 py-2 bg-cyber-blue text-black font-bold rounded-lg cursor-pointer hover:bg-cyber-blue/80 transition-colors"
        >
          Submit Order
        </button>
      )}
    </div>
  );
}

// ─── Scenario ───

function ScenarioRenderer({ q, answered, onAnswer }: { q: ScenarioQuestion; answered: boolean; onAnswer: (c: boolean) => void }) {
  const [nodeId, setNodeId] = useState(q.startNodeId);
  const [feedback, setFeedback] = useState('');
  const [, setTotalXP] = useState(0);
  const [done, setDone] = useState(false);

  const node = q.nodes.find(n => n.id === nodeId);
  if (!node) return <p>Scenario error: node not found.</p>;

  const handleChoice = (choice: typeof node.choices[number]) => {
    setFeedback(choice.feedback);
    if (choice.delta?.xp) setTotalXP(prev => prev + choice.delta!.xp!);

    if (choice.outcome === 'win') {
      setDone(true);
      onAnswer(true);
    } else if (choice.outcome === 'lose') {
      setDone(true);
      onAnswer(false);
    } else if (choice.nextId) {
      setTimeout(() => {
        setNodeId(choice.nextId!);
        setFeedback('');
      }, 2000);
    }
  };

  return (
    <div>
      <p className="text-sm mb-4 leading-relaxed bg-cyber-darker p-3 rounded-lg border border-cyber-border">{node.text}</p>
      {!done && !feedback && (
        <div className="flex flex-col gap-2">
          {node.choices.map((ch, i) => (
            <button
              key={i}
              onClick={() => handleChoice(ch)}
              className="text-left px-4 py-3 rounded-lg border border-cyber-border hover:border-cyber-blue/50 transition-colors cursor-pointer text-sm"
            >
              {ch.label}
            </button>
          ))}
        </div>
      )}
      {feedback && (
        <div className={`mt-3 p-3 rounded-lg text-sm animate-fade-in ${done ? (answered ? 'bg-green-500/10 border border-green-500' : 'bg-red-500/10 border border-red-500') : 'bg-cyber-blue/10 border border-cyber-blue'}`}>
          {feedback}
        </div>
      )}
    </div>
  );
}
