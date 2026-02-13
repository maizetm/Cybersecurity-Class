import { useGame } from '../engine/GameContext';

export default function ProgressHUD() {
  const { profile } = useGame();
  const xpPercent = Math.round((profile.xp / profile.xpToNext) * 100);

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-cyber-panel border-b border-cyber-border text-sm flex-wrap">
      <div className="flex items-center gap-1">
        <span className="text-cyber-blue font-bold">Lv.{profile.level}</span>
        <div className="w-24 h-2 bg-cyber-darker rounded-full overflow-hidden">
          <div
            className="h-full bg-cyber-blue transition-all duration-500 rounded-full"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
        <span className="text-xs text-gray-400">{profile.xp}/{profile.xpToNext}</span>
      </div>

      <div className="flex items-center gap-1 text-cyber-gold">
        <span>🪙</span>
        <span className="font-bold">{profile.coins}</span>
      </div>

      <div className="flex items-center gap-1 text-cyber-orange">
        <span>🔥</span>
        <span className="font-bold">{profile.streak}</span>
      </div>

      <div className="flex items-center gap-1 text-cyber-green">
        <span>🛡️</span>
        <span className="font-bold">{profile.shields}</span>
      </div>

      <div className="flex items-center gap-1 text-gray-400">
        <span>✅</span>
        <span>{profile.totalCorrect}/{profile.totalAnswered}</span>
      </div>
    </div>
  );
}
