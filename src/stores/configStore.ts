import { create } from 'zustand';
import { ConfiguracionGuardada } from '@/types';
import StorageService from '@/services/storageService';

interface ConfigState {
  // Estado
  config: ConfiguracionGuardada | null;
  isLoading: boolean;
  isFirstRun: boolean;
  error: string | null;

  // Acciones
  loadConfig: () => Promise<void>;
  saveConfig: (config: ConfiguracionGuardada) => Promise<void>;
  updateConfig: (updates: Partial<ConfiguracionGuardada>) => Promise<void>;
  resetConfig: () => Promise<void>;
  exportConfig: () => Promise<string>;
  importConfig: (jsonString: string) => Promise<void>;

  // Templates
  saveTemplate: (type: 'FBD' | 'FDA' | 'PU', file: File) => Promise<void>;
  hasTemplate: (type: 'FBD' | 'FDA' | 'PU') => Promise<boolean>;
  deleteTemplate: (type: 'FBD' | 'FDA' | 'PU') => Promise<void>;

  // Utilidades
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  // Estado inicial
  config: null,
  isLoading: false,
  isFirstRun: false,
  error: null,

  // Cargar configuración al iniciar
  loadConfig: async () => {
    set({ isLoading: true, error: null });

    try {
      const isFirstRun = await StorageService.initialize();

      if (isFirstRun) {
        // Primera ejecución: crear configuración por defecto
        const defaultConfig = await StorageService.createDefaultConfig();
        set({
          config: defaultConfig,
          isFirstRun: true,
          isLoading: false,
        });
      } else {
        // Cargar configuración existente
        const config = await StorageService.getConfig();
        set({
          config,
          isFirstRun: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      set({
        error: 'No se pudo cargar la configuración',
        isLoading: false,
      });
    }
  },

  // Guardar configuración completa
  saveConfig: async (config: ConfiguracionGuardada) => {
    set({ isLoading: true, error: null });

    try {
      await StorageService.saveConfig(config);
      set({
        config,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      set({
        error: 'No se pudo guardar la configuración',
        isLoading: false,
      });
      throw error;
    }
  },

  // Actualizar parcialmente la configuración
  updateConfig: async (updates: Partial<ConfiguracionGuardada>) => {
    const { config } = get();
    if (!config) {
      throw new Error('No hay configuración para actualizar');
    }

    set({ isLoading: true, error: null });

    try {
      await StorageService.updateConfig(updates);
      const updatedConfig = await StorageService.getConfig();
      set({
        config: updatedConfig,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error al actualizar configuración:', error);
      set({
        error: 'No se pudo actualizar la configuración',
        isLoading: false,
      });
      throw error;
    }
  },

  // Reiniciar configuración
  resetConfig: async () => {
    set({ isLoading: true, error: null });

    try {
      await StorageService.resetConfig();
      const config = await StorageService.getConfig();
      set({
        config,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error al reiniciar configuración:', error);
      set({
        error: 'No se pudo reiniciar la configuración',
        isLoading: false,
      });
      throw error;
    }
  },

  // Exportar configuración
  exportConfig: async () => {
    try {
      return await StorageService.exportConfig();
    } catch (error) {
      console.error('Error al exportar configuración:', error);
      set({ error: 'No se pudo exportar la configuración' });
      throw error;
    }
  },

  // Importar configuración
  importConfig: async (jsonString: string) => {
    set({ isLoading: true, error: null });

    try {
      await StorageService.importConfig(jsonString);
      const config = await StorageService.getConfig();
      set({
        config,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error al importar configuración:', error);
      set({
        error: 'No se pudo importar la configuración',
        isLoading: false,
      });
      throw error;
    }
  },

  // Guardar template
  saveTemplate: async (type: 'FBD' | 'FDA' | 'PU', file: File) => {
    set({ isLoading: true, error: null });

    try {
      await StorageService.saveTemplate(type, file);

      // Recargar configuración para actualizar referencias a templates
      const config = await StorageService.getConfig();
      set({
        config,
        isLoading: false,
      });
    } catch (error) {
      console.error(`Error al guardar template ${type}:`, error);
      set({
        error: `No se pudo guardar el template ${type}`,
        isLoading: false,
      });
      throw error;
    }
  },

  // Verificar si existe template
  hasTemplate: async (type: 'FBD' | 'FDA' | 'PU') => {
    try {
      return await StorageService.hasTemplate(type);
    } catch (error) {
      console.error(`Error al verificar template ${type}:`, error);
      return false;
    }
  },

  // Eliminar template
  deleteTemplate: async (type: 'FBD' | 'FDA' | 'PU') => {
    set({ isLoading: true, error: null });

    try {
      await StorageService.deleteTemplate(type);

      // Recargar configuración
      const config = await StorageService.getConfig();
      set({
        config,
        isLoading: false,
      });
    } catch (error) {
      console.error(`Error al eliminar template ${type}:`, error);
      set({
        error: `No se pudo eliminar el template ${type}`,
        isLoading: false,
      });
      throw error;
    }
  },

  // Establecer error
  setError: (error: string | null) => {
    set({ error });
  },

  // Limpiar error
  clearError: () => {
    set({ error: null });
  },
}));

export default useConfigStore;
