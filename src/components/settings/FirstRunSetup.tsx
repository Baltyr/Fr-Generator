import React, { useState } from 'react';
import { useConfigStore } from '@/stores/configStore';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface FirstRunSetupProps {
  isOpen: boolean;
  onComplete: () => void;
}

type SetupStep = 'welcome' | 'templates' | 'userdata' | 'complete';

export const FirstRunSetup: React.FC<FirstRunSetupProps> = ({ isOpen, onComplete }) => {
  const { saveTemplate, updateConfig } = useConfigStore();
  const [currentStep, setCurrentStep] = useState<SetupStep>('welcome');
  const [templates, setTemplates] = useState<{
    FBD: File | null;
    FDA: File | null;
    PU: File | null;
  }>({
    FBD: null,
    FDA: null,
    PU: null,
  });
  const [userData, setUserData] = useState({
    nombre: '',
    area: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const canContinue = () => {
    switch (currentStep) {
      case 'welcome':
        return true;
      case 'templates':
        return templates.FBD !== null && templates.FDA !== null && templates.PU !== null;
      case 'userdata':
        return userData.nombre.trim() !== '' && userData.area.trim() !== '';
      case 'complete':
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === 'welcome') {
      setCurrentStep('templates');
    } else if (currentStep === 'templates') {
      setCurrentStep('userdata');
    } else if (currentStep === 'userdata') {
      // Save all configuration
      setIsProcessing(true);
      try {
        // Save templates
        if (templates.FBD) await saveTemplate('FBD', templates.FBD);
        if (templates.FDA) await saveTemplate('FDA', templates.FDA);
        if (templates.PU) await saveTemplate('PU', templates.PU);

        // Save user data
        await updateConfig({
          solicitante: {
            nombre: { valor: userData.nombre, recordar: true },
            area: { valor: userData.area, recordar: true },
            telefono: { valor: '', recordar: false },
          },
        });

        setCurrentStep('complete');
      } catch (error) {
        console.error('Error en configuración inicial:', error);
        alert('❌ Error al guardar la configuración. Intenta nuevamente.');
      } finally {
        setIsProcessing(false);
      }
    } else if (currentStep === 'complete') {
      onComplete();
    }
  };

  const getStepNumber = () => {
    const steps: Record<SetupStep, number> = {
      welcome: 1,
      templates: 2,
      userdata: 3,
      complete: 4,
    };
    return steps[currentStep];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Prevent closing
      size="lg"
      showCloseButton={false}
      closeOnOverlayClick={false}
      closeOnEscape={false}
    >
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-text-primary">
            Paso {getStepNumber()} de 4
          </span>
          <span className="text-sm text-text-muted">
            {currentStep === 'welcome' && 'Bienvenida'}
            {currentStep === 'templates' && 'Templates'}
            {currentStep === 'userdata' && 'Datos del usuario'}
            {currentStep === 'complete' && 'Completado'}
          </span>
        </div>
        <div className="w-full bg-bg-primary rounded-full h-2">
          <div
            className="bg-accent-purple h-2 rounded-full transition-all duration-300"
            style={{ width: `${(getStepNumber() / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step: Welcome */}
      {currentStep === 'welcome' && (
        <div className="text-center py-8">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            ¡Bienvenido a FR Generator!
          </h2>
          <p className="text-text-secondary text-lg mb-6 max-w-2xl mx-auto">
            Vamos a configurar tu aplicación en unos simples pasos.
            Esta configuración inicial te ayudará a generar FRs más rápidamente.
          </p>
          <Card padding="md" className="bg-bg-primary max-w-md mx-auto text-left">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              ¿Qué vamos a configurar?
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-accent-purple mt-0.5">✓</span>
                <span>Cargar tus templates de Excel y Word</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-purple mt-0.5">✓</span>
                <span>Configurar tus datos personales</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-purple mt-0.5">✓</span>
                <span>¡Y listo para generar FRs!</span>
              </li>
            </ul>
          </Card>
        </div>
      )}

      {/* Step: Templates */}
      {currentStep === 'templates' && (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              📄 Carga tus Templates
            </h2>
            <p className="text-text-secondary">
              Necesitamos tus plantillas de FBD, FDA y PU para generar los archivos.
              Los 3 son obligatorios.
            </p>
          </div>

          <div className="space-y-6">
            {/* FBD Template */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                <span>📊</span>
                Template FBD (Base de Datos)
              </h3>
              <FileUpload
                accept=".xlsx,.xls"
                maxSize={10}
                onFileSelect={(file) => setTemplates(prev => ({ ...prev, FBD: file }))}
                currentFileName={templates.FBD?.name}
              />
            </div>

            {/* FDA Template */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                <span>📈</span>
                Template FDA (Aplicaciones)
              </h3>
              <FileUpload
                accept=".xlsx,.xls"
                maxSize={10}
                onFileSelect={(file) => setTemplates(prev => ({ ...prev, FDA: file }))}
                currentFileName={templates.FDA?.name}
              />
            </div>

            {/* PU Template */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                <span>📝</span>
                Template PU (Pruebas Unitarias)
              </h3>
              <FileUpload
                accept=".docx,.doc"
                maxSize={10}
                onFileSelect={(file) => setTemplates(prev => ({ ...prev, PU: file }))}
                currentFileName={templates.PU?.name}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step: User Data */}
      {currentStep === 'userdata' && (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              👤 Tus Datos
            </h2>
            <p className="text-text-secondary">
              Estos datos se usarán para auto-completar los formularios de FR.
              Puedes cambiarlos más tarde en configuración.
            </p>
          </div>

          <div className="space-y-6 max-w-md mx-auto">
            <Input
              label="Nombre completo"
              placeholder="Juan Pérez"
              value={userData.nombre}
              onChange={(e) => setUserData(prev => ({ ...prev, nombre: e.target.value }))}
              required
            />

            <Input
              label="Área"
              placeholder="TI - Desarrollo"
              value={userData.area}
              onChange={(e) => setUserData(prev => ({ ...prev, area: e.target.value }))}
              required
            />

            <Card padding="sm" className="bg-bg-primary">
              <p className="text-xs text-text-muted">
                💡 <strong>Tip:</strong> Puedes agregar más datos (teléfono, URLs de servidores, etc.)
                más tarde en la sección de Configuración.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Step: Complete */}
      {currentStep === 'complete' && (
        <div className="text-center py-8">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            ¡Todo listo!
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
            Tu aplicación FR Generator está configurada y lista para usar.
          </p>
          <Card padding="md" className="bg-success-bg border-accent-green max-w-md mx-auto text-left">
            <h3 className="text-sm font-semibold text-accent-green mb-3">
              ✓ Configuración completada
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="text-accent-green">•</span>
                <span>Templates FBD, FDA y PU cargados</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-green">•</span>
                <span>Datos de usuario configurados</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-green">•</span>
                <span>Sistema de almacenamiento inicializado</span>
              </li>
            </ul>
          </Card>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
        {currentStep !== 'welcome' && currentStep !== 'complete' && (
          <Button
            variant="ghost"
            onClick={() => {
              if (currentStep === 'templates') setCurrentStep('welcome');
              else if (currentStep === 'userdata') setCurrentStep('templates');
            }}
            disabled={isProcessing}
          >
            ← Atrás
          </Button>
        )}

        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!canContinue() || isProcessing}
          isLoading={isProcessing}
        >
          {currentStep === 'complete' ? '¡Comenzar! →' : 'Continuar →'}
        </Button>
      </div>
    </Modal>
  );
};

export default FirstRunSetup;
