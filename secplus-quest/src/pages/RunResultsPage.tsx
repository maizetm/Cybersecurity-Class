import { useGame } from '../engine/GameContext';

export default function RunResultsPage() {
  const { history, setPage } = useGame();
  const lastRun = history[history.length - 1];

  if (!lastRun) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">No run results to show.</p>
        <button onClick={() => setPage('home')} className="mt-4 px-6 py-2 bg-cyber-blue text-black rounded-lg font-bold cursor-pointer">Home</button>
      </div>
    );
  }

  const accuracy = lastRun.totalQuestions > 0 ? Math.round((lastRun.correct / lastRun.totalQuestions) * 100) : 0;
  const grade = accuracy >= 90 ? 'S' : accuracy >= 80 ? 'A' : accuracy >= 70 ? 'B' : accuracy >= 60 ? 'C' : 'F';
  const gradeColor = grade === 'S' ? 'text-cyber-gold' : grade === 'A' ? 'text-cyber-green' : grade === 'B' ? 'text-cyber-blue' : grade === 'C' ? 'text-cyber-orange' : 'text-cyber-red';
  const duration = Math.round(lastRun.duration / 1000);
  const durationStr = duration > 60 ? `${Math.floor(duration / 60)}m ${duration % 60}s` : `${duration}s`;

  return (
    <div className="p-6 animate-fade-in max-w-lg mx-auto text-center">
      <h2 className="text-xl font-bold text-cyber-blue mb-2">Run Complete!</h2>
      <p className="text-sm text-gray-400 mb-6 capitalize">{lastRun.mode} run</p>

      {/* Grade */}
      <div className={`text-7xl font-black ${gradeColor} mb-4 animate-count-up`}>
        {grade}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <ResultStat label="Correct" value={`${lastRun.correct}/${lastRun.totalQuestions}`} icon="✅" />
        <ResultStat label="Accuracy" value={`${accuracy}%`} icon="🎯" />
        <ResultStat label="XP Earned" value={`+${lastRun.xpEarned}`} icon="⚡" />
        <ResultStat label="Coins" value={`+${lastRun.coinsEarned}`} icon="🪙" />
        <ResultStat label="Duration" value={durationStr} icon="⏱️" />
        <ResultStat label="Wrong" value={`${lastRun.wrong}`} icon="❌" />
      </div>

      {accuracy === 100 && (
        <div className="bg-cyber-gold/10 border border-cyber-gold rounded-lg p-3 mb-4 text-cyber-gold text-sm">
          Perfect Run! Flawless victory!
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <button
          onClick={() => setPage('home')}
          className="px-6 py-3 bg-cyber-panel border border-cyber-border text-gray-200 rounded-xl hover:border-gray-500 transition-colors cursor-pointer font-medium"
        >
          Home
        </button>
        <button
          onClick={() => setPage('run-setup')}
          className="px-6 py-3 bg-gradient-to-r from-cyber-blue to-cyan-600 text-black rounded-xl font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

function ResultStat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-cyber-panel border border-cyber-border rounded-lg p-3 text-center">
      <div className="text-lg">{icon}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}
