import { useEffect } from 'react';
import { useGame } from '../engine/GameContext';
import QuestionCard from '../components/QuestionCard';

export default function RunPage() {
  const { currentRun, answerQuestion, nextQuestion, endRun, settings } = useGame();

  // Confetti on correct answer
  useEffect(() => {
    if (currentRun?.lastAnswerCorrect && !settings.reducedMotion) {
      import('canvas-confetti').then(mod => {
        mod.default({ particleCount: 60, spread: 50, origin: { y: 0.7 }, colors: ['#00d4ff', '#00ff88', '#a855f7'] });
      });
    }
  }, [currentRun?.answered, currentRun?.lastAnswerCorrect, settings.reducedMotion]);

  if (!currentRun) return null;

  const { questions, currentIndex, correct, wrong, lives, shields, xpEarned, answered, lastAnswerCorrect, finished, mode } = currentRun;
  const question = questions[currentIndex];

  if (!question) {
    return (
      <div className="p-6 text-center animate-fade-in">
        <p className="text-gray-400 mb-4">No questions available for this configuration.</p>
        <button onClick={endRun} className="px-6 py-2 bg-cyber-blue text-black rounded-lg font-bold cursor-pointer">Back to Home</button>
      </div>
    );
  }

  const progress = ((currentIndex + (answered ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="p-4 pb-8 animate-fade-in">
      {/* Run HUD */}
      <div className="flex items-center justify-between mb-4 max-w-2xl mx-auto text-sm">
        <div className="flex items-center gap-3">
          <span className="text-gray-400">
            Q{currentIndex + 1}/{questions.length}
          </span>
          <span className="text-green-400">✓{correct}</span>
          <span className="text-red-400">✗{wrong}</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Lives */}
          <div className="flex gap-0.5">
            {Array.from({ length: mode === 'boss' ? 2 : 3 }).map((_, i) => (
              <span key={i} className={`text-lg ${i < lives ? 'text-red-400' : 'text-gray-600'}`}>♥</span>
            ))}
          </div>
          {shields > 0 && <span className="text-cyber-blue text-sm">🛡️×{shields}</span>}
          <span className="text-cyber-blue font-bold">+{xpEarned} XP</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl mx-auto h-1.5 bg-cyber-darker rounded-full overflow-hidden mb-6">
        <div className="h-full bg-cyber-blue rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Question */}
      <div className={answered && lastAnswerCorrect === false ? 'animate-shake' : ''}>
        <QuestionCard question={question} answered={answered} onAnswer={answerQuestion} />
      </div>

      {/* Next / Finish */}
      {answered && (
        <div className="flex justify-center mt-6">
          {finished ? (
            <button
              onClick={endRun}
              className="px-8 py-3 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-bold rounded-xl text-lg hover:opacity-90 transition-opacity cursor-pointer shadow-lg animate-fade-in"
            >
              View Results
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-8 py-3 bg-cyber-blue text-black font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-lg animate-fade-in"
            >
              Next Question →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
