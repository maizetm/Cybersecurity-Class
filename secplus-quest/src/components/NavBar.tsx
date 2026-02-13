import type { GamePage } from '../types';
import { useGame } from '../engine/GameContext';

const tabs: { page: GamePage; label: string; icon: string }[] = [
  { page: 'home', label: 'Home', icon: '🏠' },
  { page: 'map', label: 'Map', icon: '🗺️' },
  { page: 'forge', label: 'Forge', icon: '🔨' },
  { page: 'collection', label: 'Collection', icon: '📖' },
  { page: 'shop', label: 'Shop', icon: '🛒' },
  { page: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function NavBar() {
  const { page, setPage } = useGame();

  return (
    <nav className="flex justify-center gap-1 px-2 py-2 bg-cyber-panel border-t border-cyber-border">
      {tabs.map(t => (
        <button
          key={t.page}
          onClick={() => setPage(t.page)}
          className={`flex flex-col items-center px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer
            ${page === t.page
              ? 'bg-cyber-blue/20 text-cyber-blue'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
        >
          <span className="text-lg">{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
