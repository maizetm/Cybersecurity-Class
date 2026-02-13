import { useState } from 'react';
import { useGame } from '../engine/GameContext';
import { DOMAIN_BIOMES } from '../types';
import BossAvatar from '../components/BossAvatar';

export default function BossSetupPage() {
  const { startRun, setPage, profile } = useGame();
  const [domain, setDomain] = useState<number>(1);

  return (
    <div className="p-6 animate-fade-in max-w-lg mx-auto">
      <button onClick={() => setPage('home')} className="text-gray-400 hover:text-white mb-4 cursor-pointer text-sm">← Back</button>

      <h2 className="text-xl font-bold text-cyber-red mb-2">Boss Battle</h2>
      <p className="text-sm text-gray-400 mb-6">10 domain-focused questions. Fewer lives, bigger rewards.</p>

      {/* Selected boss preview */}
      <div className="flex justify-center mb-6">
        <BossAvatar domain={domain} size={140} defeated={profile.bossesDefeated.includes(domain)} />
      </div>

      <div className="flex flex-col gap-2 mb-6">
        {[1, 2, 3, 4, 5].map(d => {
          const biome = DOMAIN_BIOMES[d];
          const defeated = profile.bossesDefeated.includes(d);
          const active = domain === d;
          return (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors cursor-pointer text-left
                ${active ? '' : 'border-cyber-border text-gray-400 hover:border-gray-500'}`}
              style={active ? { borderColor: biome.color, backgroundColor: biome.color + '15', color: biome.color } : {}}
            >
              <span className="text-xl">{biome.icon}</span>
              <span className="flex-1 text-sm font-medium">{biome.name}</span>
              {defeated && <span className="text-xs text-green-400">✓ Defeated</span>}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => startRun('boss', [domain], 10)}
        className="w-full py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-xl text-lg hover:opacity-90 transition-opacity cursor-pointer border border-white/10 shadow-lg"
      >
        Challenge Boss →
      </button>
    </div>
  );
}
