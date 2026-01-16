/**
 * Interfaz para campos que pueden ser guardados y recordados
 */
export interface CampoGuardable<T = string> {
  valor: T;
  recordar: boolean;
}

/**
 * Configuración principal de la aplicación
 * Se guarda en localStorage y persiste entre sesiones
 */
export interface ConfiguracionGuardada {
  // Identificador único de la instalación
  id: string;
  version: string;

  // Datos del solicitante
  solicitante: {
    nombre: CampoGuardable;
    area: CampoGuardable;
    telefono: CampoGuardable;
  };

  // Servidores de Base de Datos
  servidores: {
    tipo: CampoGuardable<string>; // "Azure SQL", "SYBASE", etc.
    urlQA: CampoGuardable;
    urlPROD: CampoGuardable;
    baseDatosPorDefecto: CampoGuardable;
  };

  // URLs y organizaciones
  urls: {
    organizacionGitHub: CampoGuardable;
    organizacionGitLab: CampoGuardable;
    namespacePorDefecto: CampoGuardable;
  };

  // Configuración específica de FDA
  fda: {
    componentePorDefecto: CampoGuardable;
    actividadQA: CampoGuardable;
    actividadPROD: CampoGuardable;
  };

  // Configuración específica de PU
  pu: {
    tipoPrueba: CampoGuardable;
    ejecutorPrueba: CampoGuardable;
  };

  // Plan de Fallback
  fallback: {
    complejidad: CampoGuardable<'Baja' | 'Media' | 'Alta'>;
    desarrollador: CampoGuardable;
    jefatura: CampoGuardable;
    tiempoResolucion: CampoGuardable;
  };

  // Rutas de templates almacenados
  templates: {
    fbd: string | null;
    fda: string | null;
    pu: string | null;
  };

  // Carpeta de salida por defecto
  carpetaSalida: string;

  // Metadatos
  ultimaActualizacion: Date;
  createdAt: Date;
}

/**
 * Épica para clasificar FRs (similar a Jira)
 */
export interface Epica {
  id: string;
  nombre: string;
  descripcion?: string;
  color?: string;
  createdAt: Date;
}

/**
 * Historial de FRs generadas
 */
export interface HistorialFR {
  id: string;
  cdpsp: string;
  epica?: string; // Nombre de la épica
  epicaId?: string; // ID de la épica
  fechaCreacion: Date;
  ambientes: ('QA' | 'PROD')[];
  tiposFR: ('FBD' | 'FDA')[];
  archivosGenerados: string[];
  rutaCarpeta: string;
}

/**
 * Configuración por defecto al iniciar la aplicación por primera vez
 */
export const DEFAULT_CONFIG: Omit<ConfiguracionGuardada, 'id' | 'createdAt' | 'ultimaActualizacion'> = {
  version: '1.0.0',

  solicitante: {
    nombre: { valor: '', recordar: false },
    area: { valor: '', recordar: false },
    telefono: { valor: '', recordar: false },
  },

  servidores: {
    tipo: { valor: 'Azure SQL', recordar: true },
    urlQA: { valor: '', recordar: false },
    urlPROD: { valor: '', recordar: false },
    baseDatosPorDefecto: { valor: '', recordar: false },
  },

  urls: {
    organizacionGitHub: { valor: 'https://github.com/bupaseguros', recordar: true },
    organizacionGitLab: { valor: '', recordar: false },
    namespacePorDefecto: { valor: '', recordar: false },
  },

  fda: {
    componentePorDefecto: { valor: '', recordar: false },
    actividadQA: { valor: 'realizar pull desde dev a qa y redesplegar el servicio.', recordar: true },
    actividadPROD: { valor: 'realizar pull desde qa a master y redesplegar el servicio.', recordar: true },
  },

  pu: {
    tipoPrueba: { valor: 'Validación', recordar: true },
    ejecutorPrueba: { valor: '', recordar: false },
  },

  fallback: {
    complejidad: { valor: 'Media', recordar: true },
    desarrollador: { valor: '', recordar: false },
    jefatura: { valor: '', recordar: false },
    tiempoResolucion: { valor: 'Una hora', recordar: true },
  },

  templates: {
    fbd: null,
    fda: null,
    pu: null,
  },

  carpetaSalida: '',
};
