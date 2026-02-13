import { useGame } from '../engine/GameContext';
import { DOMAIN_NAMES, DOMAIN_BIOMES } from '../types';

export default function MapPage() {
  const { getDomainStats, profile, setPage } = useGame();

  return (
    <div className="p-6 animate-fade-in">
      <h2 className="text-xl font-bold text-cyber-blue mb-6 text-center">Security+ World Map</h2>

      <div className="grid gap-4 max-w-2xl mx-auto">
        {[1, 2, 3, 4, 5].map(domain => {
          const biome = DOMAIN_BIOMES[domain];
          const stats = getDomainStats(domain);
          const progressPercent = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;
          const bossDefeated = profile.bossesDefeated.includes(domain);

          return (
            <div
              key={domain}
              className="bg-cyber-panel border border-cyber-border rounded-xl p-5 hover:border-opacity-50 transition-colors cursor-pointer"
              style={{ borderColor: biome.color + '40' }}
              onClick={() => setPage('boss-setup')}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl border-2 flex-shrink-0"
                  style={{ borderColor: biome.color, background: biome.color + '15' }}
                >
                  {biome.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold" style={{ color: biome.color }}>{biome.name}</h3>
                    {bossDefeated && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Boss Defeated</span>}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{DOMAIN_NAMES[domain]}</p>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-cyber-darker rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%`, backgroundColor: biome.color }}
                    />
                  </div>

                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>{stats.mastered}/{stats.total} mastered</span>
                    <span>{stats.seen} seen</span>
                    <span>{stats.correct} correct</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
