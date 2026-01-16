import { Ambiente, TipoFR, FBDData, FDAData, PUData } from './fr.types';

/**
 * Datos básicos del formulario (Paso 1)
 */
export interface DatosBasicos {
  cdpsp: string;
  epica?: string; // Nombre de la épica para clasificar
  ambientes: Ambiente[];
  tiposFR: TipoFR[];
  solicitante: {
    nombre: string;
    area: string;
    telefono: string;
  };
}

/**
 * Estado completo del wizard
 */
export interface WizardState {
  // Paso actual (1-5)
  currentStep: number;

  // Datos del formulario
  formData: {
    // Paso 1: Información básica
    cdpsp: string;
    epica?: string; // Nombre de la épica
    ambientes: Ambiente[];
    tiposFR: TipoFR[];
    solicitante: {
      nombre: string;
      area: string;
      telefono: string;
    };

    // Paso 2: FBD (opcional)
    fbd: FBDData | null;

    // Paso 3: FDA (opcional)
    fda: FDAData | null;

    // Paso 4: PU (siempre requerido)
    pu: PUData | null;
  };

  // Acciones
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<WizardState['formData']>) => void;
  updateBasicInfo: (data: Partial<DatosBasicos>) => void;
  updateFBD: (data: Partial<FBDData>) => void;
  updateFDA: (data: Partial<FDAData>) => void;
  updatePU: (data: Partial<PUData>) => void;
  resetWizard: () => void;
  canProceed: (step: number) => boolean;
  getStepTitle: (step: number) => string;
}

/**
 * Props para componentes de cada paso del wizard
 */
export interface WizardStepProps {
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
}

/**
 * Validación de cada paso
 */
export interface StepValidation {
  isValid: boolean;
  errors: string[];
}
