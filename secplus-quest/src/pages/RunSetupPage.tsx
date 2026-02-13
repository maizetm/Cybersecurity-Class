import { useState } from 'react';
import { useGame } from '../engine/GameContext';
import { DOMAIN_BIOMES } from '../types';

export default function RunSetupPage() {
  const { startRun, setPage } = useGame();
  const [count, setCount] = useState(10);
  const [selectedDomains, setSelectedDomains] = useState<number[]>([]);

  const toggleDomain = (d: number) => {
    setSelectedDomains(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    );
  };

  return (
    <div className="p-6 animate-fade-in max-w-lg mx-auto">
      <button onClick={() => setPage('home')} className="text-gray-400 hover:text-white mb-4 cursor-pointer text-sm">← Back</button>

      <h2 className="text-xl font-bold text-cyber-blue mb-6">Adventure Run Setup</h2>

      {/* Question count */}
      <div className="mb-6">
        <label className="text-sm text-gray-400 mb-2 block">Questions</label>
        <div className="flex gap-2">
          {[5, 10, 20].map(n => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`flex-1 py-3 rounded-lg border font-bold text-lg transition-colors cursor-pointer
                ${count === n ? 'border-cyber-blue bg-cyber-blue/20 text-cyber-blue' : 'border-cyber-border text-gray-400 hover:border-gray-500'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Domain filter */}
      <div className="mb-6">
        <label className="text-sm text-gray-400 mb-2 block">Domains (leave empty for all)</label>
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map(d => {
            const biome = DOMAIN_BIOMES[d];
            const active = selectedDomains.includes(d);
            return (
              <button
                key={d}
                onClick={() => toggleDomain(d)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-colors cursor-pointer text-left
                  ${active ? 'border-opacity-100 bg-opacity-10' : 'border-cyber-border text-gray-400 hover:border-gray-500'}`}
                style={active ? { borderColor: biome.color, backgroundColor: biome.color + '15', color: biome.color } : {}}
              >
                <span>{biome.icon}</span>
                <span className="text-sm">{biome.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start */}
      <button
        onClick={() => startRun('adventure', selectedDomains, count)}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-xl text-lg hover:opacity-90 transition-opacity cursor-pointer border border-white/10 shadow-lg"
      >
        Start Run →
      </button>
    </div>
  );
}
