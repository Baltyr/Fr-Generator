import localforage from 'localforage';
import { ConfiguracionGuardada, HistorialFR, Epica, DEFAULT_CONFIG } from '@/types';

// Configurar localforage para usar IndexedDB
localforage.config({
  name: 'FR-Generator',
  storeName: 'fr_data',
  description: 'Almacenamiento local para FR Generator',
});

// Claves de almacenamiento
const STORAGE_KEYS = {
  CONFIG: 'app_configuration',
  HISTORY: 'fr_history',
  EPICAS: 'epicas',
  TEMPLATES: {
    FBD: 'template_fbd',
    FDA: 'template_fda',
    PU: 'template_pu',
  },
} as const;

/**
 * Servicio de almacenamiento para la aplicación
 * Maneja configuración, historial y templates usando IndexedDB
 */
export class StorageService {
  /**
   * Inicializa el almacenamiento y verifica si es la primera ejecución
   */
  static async initialize(): Promise<boolean> {
    const config = await this.getConfig();
    return config === null;
  }

  // ============================================
  // Configuración
  // ============================================

  /**
   * Obtiene la configuración guardada
   */
  static async getConfig(): Promise<ConfiguracionGuardada | null> {
    try {
      const config = await localforage.getItem<ConfiguracionGuardada>(STORAGE_KEYS.CONFIG);

      // Convertir strings de fecha a objetos Date
      if (config) {
        config.createdAt = new Date(config.createdAt);
        config.ultimaActualizacion = new Date(config.ultimaActualizacion);
      }

      return config;
    } catch (error) {
      console.error('Error al obtener configuración:', error);
      return null;
    }
  }

  /**
   * Guarda la configuración
   */
  static async saveConfig(config: ConfiguracionGuardada): Promise<void> {
    try {
      config.ultimaActualizacion = new Date();
      await localforage.setItem(STORAGE_KEYS.CONFIG, config);
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      throw new Error('No se pudo guardar la configuración');
    }
  }

  /**
   * Crea la configuración inicial
   */
  static async createDefaultConfig(): Promise<ConfiguracionGuardada> {
    const config: ConfiguracionGuardada = {
      ...DEFAULT_CONFIG,
      id: this.generateId(),
      createdAt: new Date(),
      ultimaActualizacion: new Date(),
    };

    await this.saveConfig(config);
    return config;
  }

  /**
   * Actualiza parcialmente la configuración
   */
  static async updateConfig(updates: Partial<ConfiguracionGuardada>): Promise<void> {
    const config = await this.getConfig();
    if (!config) {
      throw new Error('No existe configuración para actualizar');
    }

    const updatedConfig = { ...config, ...updates };
    await this.saveConfig(updatedConfig);
  }

  /**
   * Reinicia la configuración a valores por defecto
   */
  static async resetConfig(): Promise<void> {
    await this.createDefaultConfig();
  }

  /**
   * Exporta la configuración como JSON
   */
  static async exportConfig(): Promise<string> {
    const config = await this.getConfig();
    if (!config) {
      throw new Error('No hay configuración para exportar');
    }

    return JSON.stringify(config, null, 2);
  }

  /**
   * Importa configuración desde JSON
   */
  static async importConfig(jsonString: string): Promise<void> {
    try {
      const config = JSON.parse(jsonString) as ConfiguracionGuardada;

      // Validar estructura básica
      if (!config.id || !config.version) {
        throw new Error('Formato de configuración inválido');
      }

      // Actualizar timestamps
      config.ultimaActualizacion = new Date();

      await this.saveConfig(config);
    } catch (error) {
      console.error('Error al importar configuración:', error);
      throw new Error('No se pudo importar la configuración');
    }
  }

  // ============================================
  // Templates
  // ============================================

  /**
   * Guarda un template como Base64
   */
  static async saveTemplate(type: 'FBD' | 'FDA' | 'PU', file: File): Promise<void> {
    try {
      // Convertir archivo a Base64
      const base64 = await this.fileToBase64(file);

      // Guardar en IndexedDB
      await localforage.setItem(STORAGE_KEYS.TEMPLATES[type], {
        name: file.name,
        size: file.size,
        type: file.type,
        data: base64,
        uploadedAt: new Date().toISOString(),
      });

      // Actualizar configuración
      const currentConfig = await this.getConfig();
      await this.updateConfig({
        templates: {
          fbd: currentConfig?.templates?.fbd || null,
          fda: currentConfig?.templates?.fda || null,
          pu: currentConfig?.templates?.pu || null,
          [type.toLowerCase()]: file.name,
        },
      });
    } catch (error) {
      console.error(`Error al guardar template ${type}:`, error);
      throw new Error(`No se pudo guardar el template ${type}`);
    }
  }

  /**
   * Obtiene un template como Blob
   */
  static async getTemplate(type: 'FBD' | 'FDA' | 'PU'): Promise<Blob | null> {
    try {
      const template = await localforage.getItem<{
        data: string;
        type: string;
      }>(STORAGE_KEYS.TEMPLATES[type]);

      if (!template) {
        return null;
      }

      // Convertir Base64 a Blob
      return this.base64ToBlob(template.data, template.type);
    } catch (error) {
      console.error(`Error al obtener template ${type}:`, error);
      return null;
    }
  }

  /**
   * Verifica si existe un template
   */
  static async hasTemplate(type: 'FBD' | 'FDA' | 'PU'): Promise<boolean> {
    const template = await localforage.getItem(STORAGE_KEYS.TEMPLATES[type]);
    return template !== null;
  }

  /**
   * Elimina un template
   */
  static async deleteTemplate(type: 'FBD' | 'FDA' | 'PU'): Promise<void> {
    await localforage.removeItem(STORAGE_KEYS.TEMPLATES[type]);

    // Actualizar configuración
    const currentConfig = await this.getConfig();
    await this.updateConfig({
      templates: {
        fbd: currentConfig?.templates?.fbd || null,
        fda: currentConfig?.templates?.fda || null,
        pu: currentConfig?.templates?.pu || null,
        [type.toLowerCase()]: null,
      },
    });
  }

  // ============================================
  // Historial
  // ============================================

  /**
   * Obtiene el historial de FRs generadas
   */
  static async getHistory(): Promise<HistorialFR[]> {
    try {
      const history = await localforage.getItem<HistorialFR[]>(STORAGE_KEYS.HISTORY);

      if (!history) {
        return [];
      }

      // Convertir strings de fecha a objetos Date
      return history.map(item => ({
        ...item,
        fechaCreacion: new Date(item.fechaCreacion),
      }));
    } catch (error) {
      console.error('Error al obtener historial:', error);
      return [];
    }
  }

  /**
   * Agrega una FR al historial
   */
  static async addToHistory(fr: HistorialFR): Promise<void> {
    try {
      const history = await this.getHistory();

      // Agregar al inicio
      history.unshift(fr);

      // Mantener solo últimas 50
      const limitedHistory = history.slice(0, 50);

      await localforage.setItem(STORAGE_KEYS.HISTORY, limitedHistory);
    } catch (error) {
      console.error('Error al agregar al historial:', error);
      throw new Error('No se pudo guardar en el historial');
    }
  }

  /**
   * Elimina una FR del historial
   */
  static async removeFromHistory(id: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const filtered = history.filter(item => item.id !== id);
      await localforage.setItem(STORAGE_KEYS.HISTORY, filtered);
    } catch (error) {
      console.error('Error al eliminar del historial:', error);
      throw new Error('No se pudo eliminar del historial');
    }
  }

  /**
   * Limpia todo el historial
   */
  static async clearHistory(): Promise<void> {
    await localforage.setItem(STORAGE_KEYS.HISTORY, []);
  }

  /**
   * Exporta historial como CSV
   */
  static async exportHistoryToCSV(): Promise<string> {
    const history = await this.getHistory();

    const headers = ['CDPSP', 'Fecha', 'Ambientes', 'Tipos FR', 'Archivos', 'Carpeta'];
    const rows = history.map(item => [
      item.cdpsp,
      item.fechaCreacion.toLocaleDateString('es-ES'),
      item.ambientes.join(', '),
      item.tiposFR.join(', '),
      item.archivosGenerados.length.toString(),
      item.rutaCarpeta,
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');
  }

  // ============================================
  // Utilidades
  // ============================================

  /**
   * Genera un ID único
   */
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Convierte un File a Base64
   */
  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // Remover prefijo data:...;base64,
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Convierte Base64 a Blob
   */
  private static base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  // ============================================
  // Épicas
  // ============================================

  /**
   * Obtiene todas las épicas
   */
  static async getEpicas(): Promise<Epica[]> {
    try {
      const epicas = await localforage.getItem<Epica[]>(STORAGE_KEYS.EPICAS);
      if (!epicas) {
        return [];
      }
      // Convertir strings de fecha a objetos Date
      return epicas.map(epica => ({
        ...epica,
        createdAt: new Date(epica.createdAt),
      }));
    } catch (error) {
      console.error('Error al obtener épicas:', error);
      return [];
    }
  }

  /**
   * Crea o actualiza una épica
   */
  static async saveEpica(epica: Omit<Epica, 'id' | 'createdAt'> | Epica): Promise<Epica> {
    try {
      const epicas = await this.getEpicas();

      // Si tiene ID, actualizar
      if ('id' in epica && epica.id) {
        const index = epicas.findIndex(e => e.id === epica.id);
        if (index !== -1) {
          epicas[index] = { ...epica, createdAt: epicas[index].createdAt };
          await localforage.setItem(STORAGE_KEYS.EPICAS, epicas);
          return epicas[index];
        }
      }

      // Si no tiene ID, crear nueva
      const nuevaEpica: Epica = {
        ...epica,
        id: this.generateId(),
        createdAt: new Date(),
      };

      epicas.push(nuevaEpica);
      await localforage.setItem(STORAGE_KEYS.EPICAS, epicas);
      return nuevaEpica;
    } catch (error) {
      console.error('Error al guardar épica:', error);
      throw new Error('No se pudo guardar la épica');
    }
  }

  /**
   * Elimina una épica
   */
  static async deleteEpica(id: string): Promise<void> {
    try {
      const epicas = await this.getEpicas();
      const filtered = epicas.filter(e => e.id !== id);
      await localforage.setItem(STORAGE_KEYS.EPICAS, filtered);
    } catch (error) {
      console.error('Error al eliminar épica:', error);
      throw new Error('No se pudo eliminar la épica');
    }
  }

  /**
   * Obtiene una épica por nombre
   */
  static async getEpicaByName(nombre: string): Promise<Epica | null> {
    try {
      const epicas = await this.getEpicas();
      return epicas.find(e => e.nombre.toLowerCase() === nombre.toLowerCase()) || null;
    } catch (error) {
      console.error('Error al buscar épica:', error);
      return null;
    }
  }

  /**
   * Limpia todo el almacenamiento (usar con precaución)
   */
  static async clearAll(): Promise<void> {
    await localforage.clear();
  }
}

export default StorageService;
