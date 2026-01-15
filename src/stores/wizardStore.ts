import { create } from 'zustand';
import { Ambiente, TipoFR, FBDData, FDAData, PUData } from '@/types';

interface WizardFormData {
  // Paso 1: Información básica
  cdpsp: string;
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
}

interface WizardState {
  // Estado
  currentStep: number;
  formData: WizardFormData;
  isCompleted: boolean;

  // Acciones de navegación
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;

  // Acciones de datos
  updateFormData: (data: Partial<WizardFormData>) => void;
  updateBasicInfo: (data: Partial<WizardFormData>) => void;
  updateFBD: (data: Partial<FBDData> | null) => void;
  updateFDA: (data: Partial<FDAData> | null) => void;
  updatePU: (data: Partial<PUData> | null) => void;

  // Validación y utilidades
  canProceed: (step: number) => boolean;
  getStepTitle: (step: number) => string;
  getTotalSteps: () => number;
  resetWizard: () => void;

  // Persistencia
  saveProgress: () => void;
  loadProgress: () => void;
}

const INITIAL_FORM_DATA: WizardFormData = {
  cdpsp: '',
  ambientes: [],
  tiposFR: [],
  solicitante: {
    nombre: '',
    area: '',
    telefono: '',
  },
  fbd: null,
  fda: null,
  pu: null,
};

export const useWizardStore = create<WizardState>((set, get) => ({
  // Estado inicial
  currentStep: 1,
  formData: INITIAL_FORM_DATA,
  isCompleted: false,

  // Establecer paso específico
  setStep: (step: number) => {
    const totalSteps = get().getTotalSteps();
    if (step >= 1 && step <= totalSteps) {
      set({ currentStep: step });
      get().saveProgress();
    }
  },

  // Siguiente paso
  nextStep: () => {
    const { currentStep, getTotalSteps } = get();
    if (currentStep < getTotalSteps()) {
      set({ currentStep: currentStep + 1 });
      get().saveProgress();
    }
  },

  // Paso anterior
  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
      get().saveProgress();
    }
  },

  // Ir a paso específico
  goToStep: (step: number) => {
    const totalSteps = get().getTotalSteps();
    if (step >= 1 && step <= totalSteps) {
      set({ currentStep: step });
      get().saveProgress();
    }
  },

  // Actualizar datos del formulario
  updateFormData: (data: Partial<WizardFormData>) => {
    set(state => ({
      formData: {
        ...state.formData,
        ...data,
      },
    }));
    get().saveProgress();
  },

  // Actualizar información básica
  updateBasicInfo: (data: Partial<WizardFormData>) => {
    set(state => ({
      formData: {
        ...state.formData,
        ...data,
      },
    }));
    get().saveProgress();
  },

  // Actualizar FBD
  updateFBD: (data: Partial<FBDData> | null) => {
    set(state => ({
      formData: {
        ...state.formData,
        fbd: data ? { ...state.formData.fbd, ...data } as FBDData : null,
      },
    }));
    get().saveProgress();
  },

  // Actualizar FDA
  updateFDA: (data: Partial<FDAData> | null) => {
    set(state => ({
      formData: {
        ...state.formData,
        fda: data ? { ...state.formData.fda, ...data } as FDAData : null,
      },
    }));
    get().saveProgress();
  },

  // Actualizar PU
  updatePU: (data: Partial<PUData> | null) => {
    set(state => ({
      formData: {
        ...state.formData,
        pu: data ? { ...state.formData.pu, ...data } as PUData : null,
      },
    }));
    get().saveProgress();
  },

  // Verificar si se puede proceder al siguiente paso
  canProceed: (step: number) => {
    const { formData } = get();

    switch (step) {
      case 1: // Información básica
        return !!(
          formData.cdpsp &&
          formData.ambientes.length > 0 &&
          formData.tiposFR.length > 0 &&
          formData.solicitante.nombre &&
          formData.solicitante.area
        );

      case 2: // FBD
        if (!formData.tiposFR.includes('FBD')) return true;
        return formData.fbd !== null;

      case 3: // FDA
        if (!formData.tiposFR.includes('FDA')) return true;
        return formData.fda !== null;

      case 4: // PU
        return formData.pu !== null;

      case 5: // Resumen
        return true;

      default:
        return false;
    }
  },

  // Obtener título del paso
  getStepTitle: (step: number) => {
    const { formData } = get();

    switch (step) {
      case 1:
        return 'Información Básica';
      case 2:
        return formData.tiposFR.includes('FBD') ? 'Configuración FBD' : 'FBD (Omitir)';
      case 3:
        return formData.tiposFR.includes('FDA') ? 'Configuración FDA' : 'FDA (Omitir)';
      case 4:
        return 'Pruebas Unitarias';
      case 5:
        return 'Resumen y Generación';
      default:
        return `Paso ${step}`;
    }
  },

  // Obtener total de pasos
  getTotalSteps: () => {
    return 5; // Fijo: Básico, FBD, FDA, PU, Resumen
  },

  // Reiniciar wizard
  resetWizard: () => {
    set({
      currentStep: 1,
      formData: INITIAL_FORM_DATA,
      isCompleted: false,
    });
    localStorage.removeItem('wizard_progress');
  },

  // Guardar progreso en localStorage
  saveProgress: () => {
    const { currentStep, formData } = get();
    try {
      localStorage.setItem('wizard_progress', JSON.stringify({
        currentStep,
        formData,
        savedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error al guardar progreso del wizard:', error);
    }
  },

  // Cargar progreso desde localStorage
  loadProgress: () => {
    try {
      const saved = localStorage.getItem('wizard_progress');
      if (saved) {
        const { currentStep, formData } = JSON.parse(saved);
        set({
          currentStep,
          formData,
        });
      }
    } catch (error) {
      console.error('Error al cargar progreso del wizard:', error);
    }
  },
}));

export default useWizardStore;
