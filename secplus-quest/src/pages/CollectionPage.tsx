import { useState } from 'react';
import { useGame } from '../engine/GameContext';
import { DOMAIN_BIOMES } from '../types';
import { ACHIEVEMENT_DEFS } from '../engine/achievements';

type Tab = 'cards' | 'achievements';

export default function CollectionPage() {
  const [tab, setTab] = useState<Tab>('cards');

  return (
    <div className="p-6 animate-fade-in">
      <h2 className="text-xl font-bold text-cyber-blue mb-4 text-center">Collection</h2>

      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setTab('cards')}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors
            ${tab === 'cards' ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue' : 'text-gray-400 border border-cyber-border hover:border-gray-500'}`}
        >
          Question Cards
        </button>
        <button
          onClick={() => setTab('achievements')}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors
            ${tab === 'achievements' ? 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple' : 'text-gray-400 border border-cyber-border hover:border-gray-500'}`}
        >
          Achievements
        </button>
      </div>

      {tab === 'cards' ? <CardsView /> : <AchievementsView />}
    </div>
  );
}

function CardsView() {
  const { questions, mastery } = useGame();
  const [filterDomain, setFilterDomain] = useState<number>(0);

  const filtered = filterDomain > 0 ? questions.filter(q => q.domain === filterDomain) : questions;

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        <button
          onClick={() => setFilterDomain(0)}
          className={`px-3 py-1 rounded-full text-xs cursor-pointer ${filterDomain === 0 ? 'bg-cyber-blue/20 text-cyber-blue' : 'text-gray-400'}`}
        >All</button>
        {[1, 2, 3, 4, 5].map(d => (
          <button
            key={d}
            onClick={() => setFilterDomain(d)}
            className={`px-3 py-1 rounded-full text-xs cursor-pointer ${filterDomain === d ? 'bg-cyber-blue/20 text-cyber-blue' : 'text-gray-400'}`}
          >
            {DOMAIN_BIOMES[d].icon} D{d}
          </button>
        ))}
      </div>

      <div className="grid gap-2 max-w-2xl mx-auto max-h-[60vh] overflow-y-auto pr-1">
        {filtered.map(q => {
          const m = mastery[q.id];
          const statusColor = !m ? 'border-gray-600' :
            m.status === 'mastered' ? 'border-green-500' :
            m.status === 'review' ? 'border-yellow-500' :
            m.status === 'learning' ? 'border-blue-500' : 'border-gray-600';

          return (
            <div key={q.id} className={`bg-cyber-panel border ${statusColor} rounded-lg p-3 text-sm`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: DOMAIN_BIOMES[q.domain].color }}>
                  {DOMAIN_BIOMES[q.domain].icon} D{q.domain} · {q.difficulty}
                </span>
                <span className="text-xs text-gray-400">
                  {m ? `${m.timesCorrect}/${m.timesSeen} · ${m.status}` : 'unseen'}
                </span>
              </div>
              <p className="text-gray-300 line-clamp-2">{q.prompt}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AchievementsView() {
  const { profile } = useGame();

  return (
    <div className="grid gap-3 max-w-2xl mx-auto sm:grid-cols-2">
      {ACHIEVEMENT_DEFS.map(a => {
        const unlocked = profile.achievementIds.includes(a.id);
        return (
          <div
            key={a.id}
            className={`bg-cyber-panel border rounded-lg p-4 ${unlocked ? 'border-cyber-gold' : 'border-cyber-border opacity-60'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{unlocked ? a.icon : '🔒'}</span>
              <div>
                <h4 className={`font-bold text-sm ${unlocked ? 'text-cyber-gold' : 'text-gray-400'}`}>{a.name}</h4>
                <p className="text-xs text-gray-400">{a.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
