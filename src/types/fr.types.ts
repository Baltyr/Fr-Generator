/**
 * Tipos de ambientes disponibles
 */
export type Ambiente = 'QA' | 'PROD';

/**
 * Tipos de FR disponibles
 */
export type TipoFR = 'FBD' | 'FDA' | 'PU';

/**
 * Plan de Fallback (usado en FBD y FDA)
 */
export interface PlanFallback {
  complejidad: 'Baja' | 'Media' | 'Alta';
  tipoDistribucion: string;
  descripcion: string;
  desarrollador: string;
  jefatura: string;
  tiempoResolucion: string;
}

// ============================================
// FBD (Formulario Base de Datos)
// ============================================

/**
 * Script SQL para ejecutar
 */
export interface ScriptSQL {
  orden: number;
  nombre: string;
  archivoPath: string;
  observaciones: string;
}

/**
 * Stored Procedure para compilar
 */
export interface StoredProcedure {
  numero: number;
  rutaGitLab: string;
  observaciones: string;
}

/**
 * Tabla a crear o modificar
 */
export interface TablaModificacion {
  tipo: 'Crear' | 'Modificar';
  nombreTabla: string;
  script: string;
  proyeccionRegistros: string;
}

/**
 * Otros objetos de BD (índices, triggers, etc.)
 */
export interface OtroObjetoBD {
  tipo: 'Índice' | 'Secuencia' | 'Constraint' | 'Trigger' | 'DBLink' | 'Otro';
  nombre: string;
  descripcion: string;
}

/**
 * Traspaso de datos entre ambientes
 */
export interface TraspasoDatos {
  ambienteOrigen: string;
  ambienteDestino: string;
  baseDatos: string;
  tablas: string[];
  observaciones: string;
}

/**
 * Rol a crear
 */
export interface RolCreacion {
  nombreRol: string;
  descripcion: string;
}

/**
 * Cuenta y permisos
 */
export interface CuentaPermiso {
  tipoPermiso: string;
  tipoObjeto: string;
  baseDatos: string;
  objeto: string;
  cuentaServicio: string;
}

/**
 * Inscripción en portal
 */
export interface InscripcionPortal {
  script: string;
  observaciones: string;
}

/**
 * Datos completos del FBD
 */
export interface FBDData {
  servidorTipo: string;
  baseDatos: string;
  dependeDeOtraFR: boolean;
  numeroFRDependencia?: number;

  operaciones: {
    ejecucion: boolean;
    compilacion: boolean;
    tablas: boolean;
    otrosObjetos: boolean;
    traspasoDatos: boolean;
    cuentasPermisos: boolean;
    creacionRoles: boolean;
    inscripcionPortal: boolean;
    planFallback: boolean;
  };

  scripts?: ScriptSQL[];
  storedProcedures?: StoredProcedure[];
  tablas?: TablaModificacion[];
  otrosObjetos?: OtroObjetoBD[];
  traspasoDatos?: TraspasoDatos;
  cuentasPermisos?: CuentaPermiso[];
  roles?: RolCreacion[];
  inscripcionPortal?: InscripcionPortal[];
  planFallback?: PlanFallback;
}

// ============================================
// FDA (Formulario Despliegue Aplicaciones)
// ============================================

/**
 * Tipos de despliegue disponibles
 */
export type TipoDespliegue =
  | 'LEGACY'
  | 'NET_SITIOS'
  | 'NET_WS'
  | 'API_TYK'
  | 'API_KONG'
  | 'GITLAB_AZURE';

/**
 * Componente para despliegue Legacy
 */
export interface ComponenteLegacy {
  nombre: string;
  sistema: string;
  version: string;
  rutaGitLab: string;
}

/**
 * Despliegue Legacy (Delphi, DLL, EXE)
 */
export interface LegacyDeployment {
  componentes: ComponenteLegacy[];
  checklist: string[];
}

/**
 * Despliegue .NET Sitios
 */
export interface NetSitiosDeployment {
  componentes: ComponenteLegacy[];
  urlPrueba: string;
  checklist: string[];
}

/**
 * Despliegue .NET Web Services
 */
export interface NetWSDeployment {
  componentes: ComponenteLegacy[];
  urlWSDL: string;
  checklist: string[];
}

/**
 * Despliegue API TYK
 */
export interface APITYKDeployment {
  componentes: ComponenteLegacy[];
  checklist: string[];
}

/**
 * Credenciales OAuth para API KONG
 */
export interface CredencialesOAuth {
  clientId: string;
  clientSecret: string;
}

/**
 * Despliegue API KONG
 */
export interface APIKONGDeployment {
  componentes: {
    nombre: string;
    linkGitHub: string;
  }[];
  credencialesOAuth?: CredencialesOAuth;
  acciones: {
    merge: boolean;
    crearCredenciales: boolean;
    configurarProxy: boolean;
  };
}

/**
 * ConfigMap para GitLab-Azure
 */
export interface ConfigMapEntry {
  key: string;
  value: string;
}

/**
 * Despliegue GitLab - Azure (más común)
 */
export interface GitLabAzureDeployment {
  componente: string;
  namespace: string;
  name: string;
  description: string;
  linkGitHub: string;
  actividad: string;
  redesplegar: boolean;
  configMap?: ConfigMapEntry[];
}

/**
 * Datos completos del FDA
 */
export interface FDAData {
  tipoDespliegue: TipoDespliegue;
  dependeDeOtraFR: boolean;
  numeroFRDependencia?: number;
  observaciones: string;

  // Type-specific data
  gitlabAzure?: GitLabAzureDeployment;
  legacy?: LegacyDeployment;
  netSitios?: NetSitiosDeployment;
  netWS?: NetWSDeployment;
  apiTyk?: APITYKDeployment;
  apiKong?: APIKONGDeployment;

  planFallback?: PlanFallback;
}

// ============================================
// PU (Pruebas Unitarias)
// ============================================

/**
 * Evidencia de prueba (imagen)
 */
export interface EvidenciaImagen {
  nombre: string;
  base64: string;
  width: number;
  height: number;
}

/**
 * Datos completos del PU
 */
export interface PUData {
  casoPrueba: string;
  descripcion: string;
  responsables: string;
  tipoPrueba: string;
  estado: 'Exitosa' | 'Fallida' | 'Pendiente';
  numeroEjecucion: number;
  fechaPlanificada: Date;
  fechaEjecucion: Date;
  ejecutor: string;
  resultado: 'OK' | 'FAIL';
  evidencias: EvidenciaImagen[];
}

// ============================================
// Resultado de generación
// ============================================

/**
 * Resultado de la generación de archivos
 */
export interface ResultadoGeneracion {
  exitoso: boolean;
  archivosCreados: string[];
  carpetaSalida: string;
  errores?: string[];
}
