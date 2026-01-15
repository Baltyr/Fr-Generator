import React from 'react';
import { useWizardStore } from '@/stores/wizardStore';
import { WizardLayout } from './WizardLayout';
import { Step1BasicInfo } from './steps/Step1BasicInfo';
import { Step2FBD } from './steps/Step2FBD';
import { Step3FDA } from './steps/Step3FDA';
import { Step4PU } from './steps/Step4PU';
import { Step5Summary } from './steps/Step5Summary';

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
        return <Step2FBD />;
      case 3:
        return <Step3FDA />;
      case 4:
        return <Step4PU />;
      case 5:
        return <Step5Summary />;
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
