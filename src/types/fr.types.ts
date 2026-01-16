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
  id: string;
  orden: number;
  nombre: string;
  tipo: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'CREATE' | 'ALTER' | 'DROP' | 'OTROS';
  descripcion: string;
  sql: string;
}

/**
 * Stored Procedure para compilar
 */
export interface StoredProcedure {
  id: string;
  orden: number;
  nombre: string;
  descripcion: string;
  parametros: string[];
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
  baseDatos: string;
  esquema: string;
  scripts: ScriptSQL[];
  storedProcedures: StoredProcedure[];
  observaciones: string;
}

// ============================================
// FDA (Formulario Despliegue Aplicaciones)
// ============================================

/**
 * Archivo modificado en el FDA
 */
export interface ArchivoModificado {
  id: string;
  ruta: string;
  tipo: 'Nuevo' | 'Modificado' | 'Eliminado';
  descripcion: string;
}

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
  componente: string;
  urlRepositorio: string;
  branch: string;
  archivos: ArchivoModificado[];
  observaciones: string;
}

// ============================================
// PU (Pruebas Unitarias)
// ============================================

/**
 * Caso de prueba
 */
export interface CasoPrueba {
  id: string;
  nombre: string;
  descripcion: string;
  precondiciones: string;
  pasos: string[];
  resultadoEsperado: string;
  estado: 'Pendiente' | 'En Progreso' | 'Aprobado' | 'Rechazado';
}

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
  tipoPrueba: string;
  ejecutor: string;
  herramienta: string;
  casos: CasoPrueba[];
  observaciones: string;
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
