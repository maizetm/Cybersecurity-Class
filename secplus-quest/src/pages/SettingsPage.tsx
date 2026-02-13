import { useRef } from 'react';
import { useGame } from '../engine/GameContext';
import { exportAll, importAll } from '../engine/storage';

export default function SettingsPage() {
  const { settings, updateSettings, resetProgress, profile } = useGame();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const blob = new Blob([exportAll()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `secplus-quest-save-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importAll(reader.result as string);
        window.location.reload();
      } catch {
        alert('Invalid save file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Are you sure? This will erase all progress.')) {
      resetProgress();
    }
  };

  return (
    <div className="p-6 animate-fade-in max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-cyber-blue mb-6 text-center">Settings</h2>

      <div className="flex flex-col gap-4">
        {/* Sound */}
        <ToggleSetting
          label="Sound Effects"
          description="Play sounds on correct/wrong answers"
          checked={settings.soundEnabled}
          onChange={v => updateSettings({ soundEnabled: v })}
        />

        {/* Reduced motion */}
        <ToggleSetting
          label="Reduced Motion"
          description="Disable animations and confetti"
          checked={settings.reducedMotion}
          onChange={v => updateSettings({ reducedMotion: v })}
        />

        {/* Forge size */}
        <div className="bg-cyber-panel border border-cyber-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm">Daily Forge Size</h4>
              <p className="text-xs text-gray-400">Cards per review session</p>
            </div>
            <select
              value={settings.forgeSize}
              onChange={e => updateSettings({ forgeSize: parseInt(e.target.value) })}
              className="bg-cyber-darker border border-cyber-border rounded-lg px-3 py-1 text-sm cursor-pointer"
            >
              {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-cyber-border" />

        {/* Profile stats */}
        <div className="bg-cyber-panel border border-cyber-border rounded-lg p-4">
          <h4 className="font-medium text-sm mb-2">Profile Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <span>Level: {profile.level}</span>
            <span>Total XP: {profile.xp}</span>
            <span>Total Correct: {profile.totalCorrect}</span>
            <span>Total Answered: {profile.totalAnswered}</span>
            <span>Achievements: {profile.achievementIds.length}</span>
            <span>Bosses Defeated: {profile.bossesDefeated.length}</span>
          </div>
        </div>

        {/* Import / Export */}
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex-1 py-2 bg-cyber-panel border border-cyber-border rounded-lg text-sm font-medium text-gray-300 hover:border-gray-500 cursor-pointer transition-colors"
          >
            Export Save
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-2 bg-cyber-panel border border-cyber-border rounded-lg text-sm font-medium text-gray-300 hover:border-gray-500 cursor-pointer transition-colors"
          >
            Import Save
          </button>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="py-2 border border-red-500/50 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/10 cursor-pointer transition-colors"
        >
          Reset All Progress
        </button>
      </div>
    </div>
  );
}

function ToggleSetting({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="bg-cyber-panel border border-cyber-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-sm">{label}</h4>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
        <button
          onClick={() => onChange(!checked)}
          className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${checked ? 'bg-cyber-blue' : 'bg-gray-600'}`}
        >
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
      </div>
    </div>
  );
}
