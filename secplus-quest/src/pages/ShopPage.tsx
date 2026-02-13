import { useGame } from '../engine/GameContext';
import { ALL_COSMETICS } from '../engine/storage';

export default function ShopPage() {
  const { profile, buyCosmetic, equipCosmetic } = useGame();

  return (
    <div className="p-6 animate-fade-in">
      <h2 className="text-xl font-bold text-cyber-gold mb-2 text-center">Cosmetic Shop</h2>
      <p className="text-center text-sm text-gray-400 mb-6">🪙 {profile.coins} coins available</p>

      <div className="grid gap-3 max-w-lg mx-auto sm:grid-cols-2">
        {ALL_COSMETICS.map(c => {
          const owned = profile.unlockedCosmeticIds.includes(c.id);
          const equipped = Object.values(profile.equippedCosmetics).includes(c.id);
          const canAfford = profile.coins >= c.cost;

          return (
            <div key={c.id} className={`bg-cyber-panel border rounded-lg p-4 ${owned ? 'border-cyber-gold/50' : 'border-cyber-border'}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{c.icon}</span>
                <div>
                  <h4 className="font-bold text-sm">{c.name}</h4>
                  <p className="text-xs text-gray-400">{c.description}</p>
                </div>
              </div>

              {owned ? (
                <button
                  onClick={() => equipCosmetic(c.type, c.id)}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors
                    ${equipped ? 'bg-green-500/20 text-green-400 border border-green-500' : 'bg-cyber-panel border border-cyber-border text-gray-300 hover:border-gray-500'}`}
                >
                  {equipped ? 'Equipped' : 'Equip'}
                </button>
              ) : c.cost === 0 ? (
                <div className="text-xs text-gray-500 text-center py-1.5">Earned via achievement</div>
              ) : (
                <button
                  onClick={() => buyCosmetic(c.id, c.cost)}
                  disabled={!canAfford}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold cursor-pointer disabled:cursor-default transition-colors
                    ${canAfford ? 'bg-cyber-gold/20 text-cyber-gold border border-cyber-gold hover:bg-cyber-gold/30' : 'bg-gray-800 text-gray-500 border border-gray-700'}`}
                >
                  🪙 {c.cost}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
