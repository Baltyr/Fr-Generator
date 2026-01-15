import { useEffect, useState } from 'react';
import { useConfigStore } from '@/stores/configStore';
import { FirstRunSetup } from '@/components/settings/FirstRunSetup';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { FRWizard } from '@/components/wizard/FRWizard';
import { Button } from '@/components/ui/Button';
import { ToastContainer } from '@/components/ui/Toast';

type AppPage = 'home' | 'settings' | 'wizard' | 'history';

function App() {
  const { config, isLoading, isFirstRun, loadConfig } = useConfigStore();
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
                disabled
              >
                📋 Historial
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

        {/* Main Content */}
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 73px)' }}>
          <div className="text-center max-w-2xl px-4">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              FR Generator
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              Generador automático de archivos FR para Jira
            </p>

            {config && (
              <div className="bg-bg-card border border-border rounded-lg p-6 text-left mb-8">
                <h3 className="text-lg font-semibold mb-3 text-accent-purple">
                  ✅ Sistema inicializado correctamente
                </h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• Storage Service (IndexedDB)</li>
                  <li>• Configuración Zustand Store</li>
                  <li>• Wizard State Management</li>
                  <li>• Sistema de templates</li>
                  <li>• Historial de FRs</li>
                  <li>• Componentes UI base</li>
                  <li>• Páginas de configuración</li>
                </ul>
                <p className="text-xs text-text-muted mt-4">
                  Config ID: {config.id.slice(0, 12)}...
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setCurrentPage('wizard')}
                className="w-full"
              >
                ➕ Crear nuevo FR
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setCurrentPage('settings')}
                className="w-full"
              >
                ⚙️ Ir a Configuración
              </Button>
            </div>

            <div className="mt-8 p-4 bg-bg-primary border border-border rounded-lg">
              <p className="text-xs text-text-muted">
                💡 <strong>Siguiente paso:</strong> Configurar templates y datos personales en la sección de Configuración
              </p>
            </div>
          </div>
        </div>
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
