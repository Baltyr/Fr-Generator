import * as XLSX from 'xlsx';
import { StorageService } from './storageService';
import { FBDData, FDAData } from '@/types/fr.types';

/**
 * Servicio para generar archivos Excel (FBD y FDA)
 * Usa SheetJS para preservar el formato original de las plantillas
 */

class ExcelService {
  /**
   * Genera el archivo FBD (Base de Datos) en Excel
   */
  async generateFBD(
    data: FBDData,
    ambiente: 'QA' | 'PROD',
    cdpsp: string,
    basicInfo: any
  ): Promise<Blob> {
    try {
      // 1. Cargar template desde IndexedDB
      const templateBlob = await StorageService.getTemplate('FBD');
      if (!templateBlob) {
        throw new Error('Template FBD no encontrado');
      }

      // 2. Convertir Blob a ArrayBuffer
      const arrayBuffer = await templateBlob.arrayBuffer();

      // 3. Cargar workbook con SheetJS
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // 4. Obtener hoja REQUERIMIENTOS (o la primera hoja disponible)
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // 5. Modificar celdas específicas (solo valores, preserva formato)
      // NOTA: Los índices de celda deben ajustarse según la plantilla real

      // Información básica
      if (sheet['C2']) sheet['C2'].v = basicInfo.solicitante;
      if (sheet['C3']) sheet['C3'].v = basicInfo.area;
      if (sheet['C4']) sheet['C4'].v = basicInfo.telefono || '';
      if (sheet['A5']) sheet['A5'].v = cdpsp;
      if (sheet['B5']) sheet['B5'].v = basicInfo.titulo;

      // Ambiente
      if (sheet['A7']) sheet['A7'].v = ambiente === 'QA' ? 'QA' : 'PRODUCCIÓN';

      // Base de datos
      if (sheet['C10']) sheet['C10'].v = data.baseDatos || '';
      if (sheet['C11']) sheet['C11'].v = data.esquema || '';

      // 6. Si hay hoja de Scripts SQL, llenarla
      if (data.scripts && data.scripts.length > 0) {
        const scriptsSheetName = workbook.SheetNames.find(name =>
          name.toLowerCase().includes('script') || name.toLowerCase().includes('ejecución')
        );

        if (scriptsSheetName) {
          const scriptsSheet = workbook.Sheets[scriptsSheetName];

          data.scripts.forEach((script, index) => {
            const row = 9 + index; // Fila inicial para scripts (ajustar según plantilla)

            // Columnas: Orden, Nombre, Tipo, Descripción, SQL
            if (scriptsSheet[`A${row}`]) scriptsSheet[`A${row}`].v = script.orden;
            if (scriptsSheet[`B${row}`]) scriptsSheet[`B${row}`].v = script.nombre;
            if (scriptsSheet[`C${row}`]) scriptsSheet[`C${row}`].v = script.tipo;
            if (scriptsSheet[`D${row}`]) scriptsSheet[`D${row}`].v = script.descripcion;
            if (scriptsSheet[`E${row}`]) scriptsSheet[`E${row}`].v = script.sql || '';
          });
        }
      }

      // 7. Si hay hoja de Stored Procedures, llenarla
      if (data.storedProcedures && data.storedProcedures.length > 0) {
        const spSheetName = workbook.SheetNames.find(name =>
          name.toLowerCase().includes('stored') || name.toLowerCase().includes('procedimiento')
        );

        if (spSheetName) {
          const spSheet = workbook.Sheets[spSheetName];

          data.storedProcedures.forEach((sp, index) => {
            const row = 9 + index; // Fila inicial para SPs (ajustar según plantilla)

            // Columnas: Orden, Nombre, Descripción, Parámetros
            if (spSheet[`A${row}`]) spSheet[`A${row}`].v = sp.orden;
            if (spSheet[`B${row}`]) spSheet[`B${row}`].v = sp.nombre;
            if (spSheet[`C${row}`]) spSheet[`C${row}`].v = sp.descripcion;
            if (spSheet[`D${row}`]) spSheet[`D${row}`].v = sp.parametros?.join(', ') || '';
          });
        }
      }

      // Observaciones
      if (sheet['A20']) sheet['A20'].v = data.observaciones || '';

      // 8. Generar blob
      const wbout = XLSX.write(workbook, {
        type: 'array',
        bookType: 'xlsx',
        cellStyles: true // Preservar estilos
      });

      return new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
    } catch (error) {
      console.error('Error al generar FBD:', error);
      throw new Error(`Error al generar archivo FBD: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Genera el archivo FDA (Aplicaciones) en Excel
   */
  async generateFDA(
    data: FDAData,
    ambiente: 'QA' | 'PROD',
    cdpsp: string,
    basicInfo: any
  ): Promise<Blob> {
    try {
      // 1. Cargar template desde IndexedDB
      const templateBlob = await StorageService.getTemplate('FDA');
      if (!templateBlob) {
        throw new Error('Template FDA no encontrado');
      }

      // 2. Convertir Blob a ArrayBuffer
      const arrayBuffer = await templateBlob.arrayBuffer();

      // 3. Cargar workbook con SheetJS
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // 4. Obtener hoja REQUERIMIENTO
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // 5. Modificar celdas específicas

      // Información básica
      if (sheet['C2']) sheet['C2'].v = basicInfo.solicitante;
      if (sheet['C3']) sheet['C3'].v = basicInfo.area;
      if (sheet['C4']) sheet['C4'].v = basicInfo.telefono || '';
      if (sheet['A5']) sheet['A5'].v = cdpsp;
      if (sheet['B5']) sheet['B5'].v = basicInfo.titulo;

      // Ambiente
      if (sheet['A7']) sheet['A7'].v = ambiente === 'QA' ? 'QA' : 'PRODUCCIÓN';

      // Componente
      if (sheet['C10']) sheet['C10'].v = data.componente || '';
      if (sheet['C11']) sheet['C11'].v = data.urlRepositorio || '';
      if (sheet['C12']) sheet['C12'].v = data.branch || '';

      // 6. Si hay hoja de Archivos, llenarla
      if (data.archivos && data.archivos.length > 0) {
        const archivosSheetName = workbook.SheetNames.find(name =>
          name.toLowerCase().includes('archivo') || name.toLowerCase().includes('modificado')
        );

        if (archivosSheetName) {
          const archivosSheet = workbook.Sheets[archivosSheetName];

          data.archivos.forEach((archivo, index) => {
            const row = 9 + index; // Fila inicial para archivos (ajustar según plantilla)

            // Columnas: Ruta, Tipo, Descripción
            if (archivosSheet[`A${row}`]) archivosSheet[`A${row}`].v = archivo.ruta;
            if (archivosSheet[`B${row}`]) archivosSheet[`B${row}`].v = archivo.tipo;
            if (archivosSheet[`C${row}`]) archivosSheet[`C${row}`].v = archivo.descripcion;
          });
        }
      }

      // Observaciones
      if (sheet['A20']) sheet['A20'].v = data.observaciones || '';

      // 7. Generar blob
      const wbout = XLSX.write(workbook, {
        type: 'array',
        bookType: 'xlsx',
        cellStyles: true
      });

      return new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
    } catch (error) {
      console.error('Error al generar FDA:', error);
      throw new Error(`Error al generar archivo FDA: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}

export const excelService = new ExcelService();
