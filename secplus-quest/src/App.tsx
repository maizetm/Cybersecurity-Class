import { useGame, GameProvider } from './engine/GameContext';
import ProgressHUD from './components/ProgressHUD';
import NavBar from './components/NavBar';
import ToastContainer from './components/ToastContainer';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import RunSetupPage from './pages/RunSetupPage';
import BossSetupPage from './pages/BossSetupPage';
import RunPage from './pages/RunPage';
import RunResultsPage from './pages/RunResultsPage';
import CollectionPage from './pages/CollectionPage';
import ShopPage from './pages/ShopPage';
import SettingsPage from './pages/SettingsPage';
import PortsGame from './pages/PortsGame';

function AppContent() {
  const { page, loaded, settings } = useGame();

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse-glow text-cyber-blue">🔒</div>
          <p className="text-gray-400">Loading SecPlus Quest...</p>
        </div>
      </div>
    );
  }

  const showNav = !['run', 'mini-ports'].includes(page);

  return (
    <div className={`flex flex-col min-h-screen ${settings.reducedMotion ? 'reduced-motion' : ''}`}>
      <ProgressHUD />
      <main className="flex-1 overflow-y-auto">
        {page === 'home' && <HomePage />}
        {page === 'map' && <MapPage />}
        {page === 'run-setup' && <RunSetupPage />}
        {page === 'boss-setup' && <BossSetupPage />}
        {page === 'run' && <RunPage />}
        {page === 'run-results' && <RunResultsPage />}
        {page === 'forge' && <RunPage />}
        {page === 'collection' && <CollectionPage />}
        {page === 'shop' && <ShopPage />}
        {page === 'settings' && <SettingsPage />}
        {page === 'mini-ports' && <PortsGame />}
      </main>
      {showNav && <NavBar />}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
