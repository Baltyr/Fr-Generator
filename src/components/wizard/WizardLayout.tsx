import React from 'react';
import { useWizardStore } from '@/stores/wizardStore';
import { Button } from '@/components/ui/Button';

interface WizardLayoutProps {
  children: React.ReactNode;
  onClose: () => void;
}

const STEPS = [
  { number: 1, label: 'Información Básica', icon: '📋' },
  { number: 2, label: 'FBD - Base de Datos', icon: '📊' },
  { number: 3, label: 'FDA - Aplicaciones', icon: '📈' },
  { number: 4, label: 'PU - Pruebas Unitarias', icon: '📝' },
  { number: 5, label: 'Resumen y Generación', icon: '✅' },
];

export const WizardLayout: React.FC<WizardLayoutProps> = ({ children, onClose }) => {
  const { currentStep, canGoBack, canGoNext, prevStep, nextStep, reset } = useWizardStore();

  const handleClose = () => {
    if (confirm('¿Estás seguro de que deseas salir? Se perderá el progreso actual.')) {
      reset();
      onClose();
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border bg-bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-accent-purple">
              🚀 Crear nuevo FR
            </h1>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              ✕ Salir
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              const isAccessible = currentStep >= step.number;

              return (
                <React.Fragment key={step.number}>
                  {/* Step */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                        transition-all duration-200
                        ${isActive
                          ? 'bg-accent-purple text-white ring-4 ring-accent-purple/20'
                          : isCompleted
                          ? 'bg-accent-green text-white'
                          : isAccessible
                          ? 'bg-bg-primary border-2 border-border text-text-muted'
                          : 'bg-bg-primary border-2 border-border text-text-muted opacity-50'
                        }
                      `}
                    >
                      {isCompleted ? '✓' : step.number}
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-xs font-medium text-text-secondary hidden md:block">
                        {step.icon}
                      </div>
                      <div
                        className={`text-xs mt-1 max-w-[100px] ${
                          isActive ? 'text-accent-purple font-semibold' : 'text-text-muted'
                        }`}
                      >
                        {step.label}
                      </div>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < STEPS.length - 1 && (
                    <div
                      className={`
                        flex-1 h-0.5 mx-2 transition-all duration-200
                        ${isCompleted ? 'bg-accent-green' : 'bg-border'}
                      `}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer Navigation */}
      <footer className="border-t border-border bg-bg-card sticky bottom-0">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-sm text-text-muted">
            Paso {currentStep} de {STEPS.length}
          </div>

          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={!canGoBack()}
            >
              ← Anterior
            </Button>
            <Button
              variant="primary"
              onClick={nextStep}
              disabled={!canGoNext()}
            >
              {currentStep === STEPS.length ? 'Generar FR →' : 'Siguiente →'}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WizardLayout;
