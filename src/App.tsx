import { useEffect, useState } from 'react';
import { useConfigStore } from '@/stores/configStore';
import { FirstRunSetup } from '@/components/settings/FirstRunSetup';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { FRWizard } from '@/components/wizard/FRWizard';
import { HistoryPage } from '@/components/history/HistoryPage';
import { HomePage } from '@/components/home/HomePage';
import { Button } from '@/components/ui/Button';
import { ToastContainer } from '@/components/ui/Toast';

type AppPage = 'home' | 'settings' | 'wizard' | 'history';

function App() {
  const { isLoading, isFirstRun, loadConfig } = useConfigStore();
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [showFirstRunSetup, setShowFirstRunSetup] = useState(false);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    if (!isLoading && isFirstRun) {
      setShowFirstRunSetup(true);
    }
  }, [isLoading, isFirstRun]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-purple mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  // Show Wizard page
  if (currentPage === 'wizard') {
    return <FRWizard onClose={() => setCurrentPage('home')} />;
  }

  // Show Settings page
  if (currentPage === 'settings') {
    return (
      <>
        <SettingsPage />
        <Button
          variant="ghost"
          className="fixed bottom-6 left-6"
          onClick={() => setCurrentPage('home')}
        >
          ← Volver al inicio
        </Button>
      </>
    );
  }

  // Show History page
  if (currentPage === 'history') {
    return (
      <>
        <HistoryPage />
        <Button
          variant="ghost"
          className="fixed bottom-6 left-6"
          onClick={() => setCurrentPage('home')}
        >
          ← Volver al inicio
        </Button>
      </>
    );
  }

  // Home page
  return (
    <>
      <div className="min-h-screen bg-bg-primary text-text-primary">
        {/* Header */}
        <header className="border-b border-border bg-bg-card">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-accent-purple">
                🚀 FR Generator
              </h1>
              <span className="text-xs text-text-muted bg-bg-primary px-2 py-1 rounded">
                v1.0.0
              </span>
            </div>
            <nav className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage('wizard')}
              >
                ➕ Nuevo FR
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage('history')}
              >
                📜 Historial
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage('settings')}
              >
                ⚙️ Configuración
              </Button>
            </nav>
          </div>
        </header>

        {/* Main Content - HomePage Component */}
        <HomePage />
      </div>

      {/* First Run Setup Modal */}
      <FirstRunSetup
        isOpen={showFirstRunSetup}
        onComplete={() => {
          setShowFirstRunSetup(false);
          setCurrentPage('home');
        }}
      />

      {/* Toast Container */}
      <ToastContainer />
    </>
  );
}

export default App;
