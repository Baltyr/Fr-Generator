import React from 'react';
import { useWizardStore } from '@/stores/wizardStore';
import { WizardLayout } from './WizardLayout';
import { Step1BasicInfo } from './steps/Step1BasicInfo';

interface FRWizardProps {
  onClose: () => void;
}

export const FRWizard: React.FC<FRWizardProps> = ({ onClose }) => {
  const { currentStep } = useWizardStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo />;
      case 2:
        return (
          <div className="text-center py-12">
            <p className="text-text-muted">FBD Configuration - Próximamente...</p>
          </div>
        );
      case 3:
        return (
          <div className="text-center py-12">
            <p className="text-text-muted">FDA Configuration - Próximamente...</p>
          </div>
        );
      case 4:
        return (
          <div className="text-center py-12">
            <p className="text-text-muted">PU Configuration - Próximamente...</p>
          </div>
        );
      case 5:
        return (
          <div className="text-center py-12">
            <p className="text-text-muted">Resumen y Generación - Próximamente...</p>
          </div>
        );
      default:
        return <Step1BasicInfo />;
    }
  };

  return (
    <WizardLayout onClose={onClose}>
      {renderStep()}
    </WizardLayout>
  );
};

export default FRWizard;
