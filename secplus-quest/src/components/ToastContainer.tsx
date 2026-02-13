import { useGame } from '../engine/GameContext';

export default function ToastContainer() {
  const { toasts, dismissToast } = useGame();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`animate-slide-up pointer-events-auto cursor-pointer px-4 py-2 rounded-lg shadow-lg border flex items-center gap-2 text-sm
            ${t.type === 'achievement' ? 'bg-cyber-purple/90 border-cyber-purple text-white' :
              t.type === 'xp' ? 'bg-cyber-blue/90 border-cyber-blue text-white' :
              t.type === 'loot' ? 'bg-cyber-gold/90 border-cyber-gold text-black' :
              'bg-cyber-panel border-cyber-border text-gray-200'
            }`}
          onClick={() => dismissToast(t.id)}
        >
          <span className="text-lg">{t.icon}</span>
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
}
