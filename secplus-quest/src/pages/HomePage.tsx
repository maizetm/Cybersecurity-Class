import { useGame } from '../engine/GameContext';
import { streakMultiplier } from '../engine/scoring';
import CharacterAvatar from '../components/CharacterAvatar';

export default function HomePage() {
  const { profile, setPage, startRun, settings, getDueCards, history } = useGame();
  const mult = streakMultiplier(profile.streak);
  const dueCount = getDueCards().length;
  const todayRuns = history.filter(r => {
    const d = new Date(r.timestamp).toISOString().split('T')[0];
    return d === new Date().toISOString().split('T')[0];
  });
  const todayXP = todayRuns.reduce((s, r) => s + r.xpEarned, 0);

  return (
    <div className="flex flex-col items-center gap-6 p-6 animate-fade-in">
      {/* Avatar area */}
      <div className="relative">
        <CharacterAvatar
          hat={profile.equippedCosmetics.hat}
          frame={profile.equippedCosmetics.frame}
          size={120}
        />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-cyber-blue text-black text-xs font-bold px-3 py-0.5 rounded-full">
          Lv.{profile.level}
        </div>
      </div>

      <h1 className="text-2xl font-bold text-cyber-blue">
        SecPlus Quest
      </h1>
      <p className="text-gray-400 text-sm text-center">Welcome back, {profile.name}!</p>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg">
        <StatCard label="Streak" value={`${profile.streak}d`} icon="🔥" color="text-cyber-orange" />
        <StatCard label="Multiplier" value={`×${mult.toFixed(2)}`} icon="⚡" color="text-cyber-blue" />
        <StatCard label="Today XP" value={`${todayXP}`} icon="📊" color="text-cyber-green" />
        <StatCard label="Due Cards" value={`${dueCount}`} icon="📋" color="text-cyber-purple" />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <ActionButton
          label="Adventure Run"
          sub="Random questions, earn XP & loot"
          icon="⚔️"
          color="from-blue-600 to-blue-800"
          onClick={() => setPage('run-setup')}
        />
        <ActionButton
          label="Boss Battle"
          sub="Domain-focused 10Q challenge"
          icon="🐉"
          color="from-red-600 to-red-800"
          onClick={() => setPage('boss-setup')}
        />
        <ActionButton
          label="Daily Forge"
          sub={dueCount > 0 ? `${dueCount} cards due for review` : 'No cards due — good job!'}
          icon="🔨"
          color="from-purple-600 to-purple-800"
          onClick={() => startRun('forge', [], settings.forgeSize)}
        />
        <ActionButton
          label="Port & Protocol Arcade"
          sub="Match services to ports"
          icon="🎮"
          color="from-green-600 to-green-800"
          onClick={() => setPage('mini-ports')}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="bg-cyber-panel border border-cyber-border rounded-lg p-3 text-center">
      <div className="text-lg">{icon}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}

function ActionButton({ label, sub, icon, color, onClick }: { label: string; sub: string; icon: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-xl bg-gradient-to-r ${color} hover:opacity-90 transition-opacity cursor-pointer border border-white/10 shadow-lg`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="font-bold text-white">{label}</div>
          <div className="text-xs text-white/70">{sub}</div>
        </div>
      </div>
    </button>
  );
}
