import React, { useState } from 'react';
import { useWizardStore } from '@/stores/wizardStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { toast } from '@/stores/toastStore';
import { excelService } from '@/services/excelService';
import { wordService } from '@/services/wordService';
import { saveAs } from 'file-saver';
import { writeBinaryFile, createDir } from '@tauri-apps/api/fs';
import { downloadDir } from '@tauri-apps/api/path';
import { StorageService } from '@/services/storageService';
import { HistorialFR } from '@/types/config.types';

export const Step5Summary: React.FC = () => {
  const { formData } = useWizardStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!formData.basicInfo) {
      toast.error('Error', 'No hay información básica para generar');
      return;
    }

    setIsGenerating(true);
    const filesGenerated: string[] = [];

    try {
      const { basicInfo, fbd, fda, pu } = formData;
      const cdpsp = basicInfo.cdpsp;
      const epica = basicInfo.epica;

      // Obtener la carpeta de descargas
      const downloadsPath = await downloadDir();

      // Crear estructura de carpetas: Épica/FR_CDPSP/ o solo FR_CDPSP/
      let basePath: string;
      if (epica && epica.trim() !== '') {
        // Limpiar nombre de épica para usar como carpeta
        const epicaFolder = epica.replace(/[<>:"/\\|?*]/g, '_');
        basePath = `${downloadsPath}${epicaFolder}\\FR_${cdpsp}`;
      } else {
        basePath = `${downloadsPath}FR_${cdpsp}`;
      }

      // Crear las carpetas
      try {
        await createDir(basePath, { recursive: true });
      } catch (error) {
        console.error('Error creando carpetas:', error);
        // Si falla crear carpetas, usar saveAs como fallback
        toast.warning('No se pudo crear la estructura de carpetas', 'Los archivos se descargarán normalmente');
        await generateWithSaveAs();
        return;
      }

      // Generar archivos para cada ambiente seleccionado
      for (const ambiente of basicInfo.ambientes) {
        const ambienteCode = ambiente === 'QA' ? 'QA' : 'PRD';

        // Generar FBD si tiene datos
        if (fbd && (fbd.scripts?.length > 0 || fbd.storedProcedures?.length > 0)) {
          try {
            const fbdBlob = await excelService.generateFBD(
              fbd,
              ambiente,
              cdpsp,
              basicInfo
            );
            const filename = `FR_${cdpsp}_FBD_${ambienteCode}.xlsx`;
            const filePath = `${basePath}\\${filename}`;

            // Convertir Blob a ArrayBuffer
            const arrayBuffer = await fbdBlob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            await writeBinaryFile(filePath, uint8Array);
            filesGenerated.push(filename);
          } catch (error) {
            console.error('Error generando FBD:', error);
            toast.error(
              `Error al generar FBD ${ambiente}`,
              error instanceof Error ? error.message : 'Error desconocido'
            );
          }
        }

        // Generar FDA si tiene datos
        if (fda && fda.archivos?.length > 0) {
          try {
            const fdaBlob = await excelService.generateFDA(
              fda,
              ambiente,
              cdpsp,
              basicInfo
            );
            const filename = `FR_${cdpsp}_FDA_${ambienteCode}.xlsx`;
            const filePath = `${basePath}\\${filename}`;

            const arrayBuffer = await fdaBlob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            await writeBinaryFile(filePath, uint8Array);
            filesGenerated.push(filename);
          } catch (error) {
            console.error('Error generando FDA:', error);
            toast.error(
              `Error al generar FDA ${ambiente}`,
              error instanceof Error ? error.message : 'Error desconocido'
            );
          }
        }

        // Generar PU si tiene datos
        if (pu && pu.casos?.length > 0) {
          try {
            const puBlob = await wordService.generatePU(
              pu,
              ambiente,
              cdpsp,
              basicInfo
            );
            const filename = `${cdpsp}_PU_${ambienteCode}.docx`;
            const filePath = `${basePath}\\${filename}`;

            const arrayBuffer = await puBlob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            await writeBinaryFile(filePath, uint8Array);
            filesGenerated.push(filename);
          } catch (error) {
            console.error('Error generando PU:', error);
            toast.error(
              `Error al generar PU ${ambiente}`,
              error instanceof Error ? error.message : 'Error desconocido'
            );
          }
        }
      }

      // Guardar en historial
      if (filesGenerated.length > 0) {
        const historialEntry: HistorialFR = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          cdpsp,
          epica: epica || undefined,
          fechaCreacion: new Date(),
          ambientes: basicInfo.ambientes,
          tiposFR: [],
          archivosGenerados: filesGenerated,
          rutaCarpeta: basePath,
        };

        if (fbd && (fbd.scripts?.length > 0 || fbd.storedProcedures?.length > 0)) {
          historialEntry.tiposFR.push('FBD');
        }
        if (fda && fda.archivos?.length > 0) {
          historialEntry.tiposFR.push('FDA');
        }

        await StorageService.addToHistory(historialEntry);

        toast.success(
          `¡Archivos generados! (${filesGenerated.length})`,
          `Guardados en: ${basePath}`,
          8000
        );
      } else {
        toast.warning(
          'No se generaron archivos',
          'Asegúrate de haber completado al menos una sección (FBD, FDA o PU)'
        );
      }
    } catch (error) {
      console.error('Error al generar archivos:', error);
      toast.error(
        'Error al generar archivos',
        error instanceof Error ? error.message : 'Ocurrió un error inesperado'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Función de fallback usando saveAs tradicional
  const generateWithSaveAs = async () => {
    if (!formData.basicInfo) return;

    const filesGenerated: string[] = [];
    const { basicInfo, fbd, fda, pu } = formData;
    const cdpsp = basicInfo.cdpsp;

    for (const ambiente of basicInfo.ambientes) {
      const ambienteCode = ambiente === 'QA' ? 'QA' : 'PRD';

      if (fbd && (fbd.scripts?.length > 0 || fbd.storedProcedures?.length > 0)) {
        const fbdBlob = await excelService.generateFBD(fbd, ambiente, cdpsp, basicInfo);
        const filename = `FR_${cdpsp}_FBD_${ambienteCode}.xlsx`;
        saveAs(fbdBlob, filename);
        filesGenerated.push(filename);
      }

      if (fda && fda.archivos?.length > 0) {
        const fdaBlob = await excelService.generateFDA(fda, ambiente, cdpsp, basicInfo);
        const filename = `FR_${cdpsp}_FDA_${ambienteCode}.xlsx`;
        saveAs(fdaBlob, filename);
        filesGenerated.push(filename);
      }

      if (pu && pu.casos?.length > 0) {
        const puBlob = await wordService.generatePU(pu, ambiente, cdpsp, basicInfo);
        const filename = `${cdpsp}_PU_${ambienteCode}.docx`;
        saveAs(puBlob, filename);
        filesGenerated.push(filename);
      }
    }

    if (filesGenerated.length > 0) {
      toast.success(
        `¡Archivos generados! (${filesGenerated.length})`,
        `Se descargaron: ${filesGenerated.join(', ')}`,
        8000
      );
    }
  };

  const { basicInfo, fbd, fda, pu } = formData;

  const hasFBD = fbd && (fbd.scripts?.length > 0 || fbd.storedProcedures?.length > 0);
  const hasFDA = fda && fda.archivos?.length > 0;
  const hasPU = pu && pu.casos?.length > 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          ✅ Resumen del FR
        </h2>
        <p className="text-text-secondary">
          Revisa la información antes de generar los archivos.
        </p>
      </div>

      {/* Información Básica Summary */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Información Básica</CardTitle>
        </CardHeader>
        <CardContent>
          {basicInfo ? (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-text-primary">CDPSP:</span>
                  <p className="text-text-secondary">{basicInfo.cdpsp}</p>
                </div>
                <div>
                  <span className="font-semibold text-text-primary">Fecha:</span>
                  <p className="text-text-secondary">{basicInfo.fechaSolicitud}</p>
                </div>
              </div>

              <div>
                <span className="font-semibold text-text-primary">Título:</span>
                <p className="text-text-secondary">{basicInfo.titulo}</p>
              </div>

              <div>
                <span className="font-semibold text-text-primary">Descripción:</span>
                <p className="text-text-secondary">{basicInfo.descripcion}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-text-primary">Solicitante:</span>
                  <p className="text-text-secondary">{basicInfo.solicitante}</p>
                </div>
                <div>
                  <span className="font-semibold text-text-primary">Área:</span>
                  <p className="text-text-secondary">{basicInfo.area}</p>
                </div>
              </div>

              <div>
                <span className="font-semibold text-text-primary">Ambientes:</span>
                <div className="flex gap-2 mt-1">
                  {basicInfo.ambientes.map(amb => (
                    <span
                      key={amb}
                      className="px-3 py-1 bg-accent-purple/20 text-accent-purple rounded-full text-xs font-semibold"
                    >
                      {amb}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-text-muted">No hay información básica</p>
          )}
        </CardContent>
      </Card>

      {/* FBD Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>📊 FBD - Base de Datos</CardTitle>
            {hasFBD && (
              <span className="px-3 py-1 bg-accent-green/20 text-accent-green rounded-full text-xs font-semibold">
                Incluido
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {hasFBD ? (
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-text-primary">Base de Datos:</span>
                <p className="text-text-secondary">{fbd.baseDatos}</p>
              </div>

              {fbd.scripts && fbd.scripts.length > 0 && (
                <div>
                  <span className="font-semibold text-text-primary">Scripts SQL:</span>
                  <ul className="list-disc list-inside text-text-secondary mt-1">
                    {fbd.scripts.map((script, idx) => (
                      <li key={idx}>
                        {script.nombre} ({script.tipo})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {fbd.storedProcedures && fbd.storedProcedures.length > 0 && (
                <div>
                  <span className="font-semibold text-text-primary">Stored Procedures:</span>
                  <ul className="list-disc list-inside text-text-secondary mt-1">
                    {fbd.storedProcedures.map((sp, idx) => (
                      <li key={idx}>{sp.nombre}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-text-muted">No se incluirán cambios de base de datos</p>
          )}
        </CardContent>
      </Card>

      {/* FDA Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>📈 FDA - Aplicaciones</CardTitle>
            {hasFDA && (
              <span className="px-3 py-1 bg-accent-green/20 text-accent-green rounded-full text-xs font-semibold">
                Incluido
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {hasFDA ? (
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-text-primary">Componente:</span>
                <p className="text-text-secondary">{fda.componente}</p>
              </div>

              {fda.urlRepositorio && (
                <div>
                  <span className="font-semibold text-text-primary">Repositorio:</span>
                  <p className="text-text-secondary break-all">{fda.urlRepositorio}</p>
                </div>
              )}

              {fda.archivos && fda.archivos.length > 0 && (
                <div>
                  <span className="font-semibold text-text-primary">Archivos modificados:</span>
                  <ul className="list-disc list-inside text-text-secondary mt-1">
                    {fda.archivos.map((archivo, idx) => (
                      <li key={idx}>
                        {archivo.tipo === 'Nuevo' && '🆕 '}
                        {archivo.tipo === 'Modificado' && '✏️ '}
                        {archivo.tipo === 'Eliminado' && '🗑️ '}
                        {archivo.ruta}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-text-muted">No se incluirán cambios de aplicación</p>
          )}
        </CardContent>
      </Card>

      {/* PU Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>📝 PU - Pruebas Unitarias</CardTitle>
            {hasPU && (
              <span className="px-3 py-1 bg-accent-green/20 text-accent-green rounded-full text-xs font-semibold">
                Incluido
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {hasPU ? (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-text-primary">Tipo de Prueba:</span>
                  <p className="text-text-secondary">{pu.tipoPrueba}</p>
                </div>
                {pu.ejecutor && (
                  <div>
                    <span className="font-semibold text-text-primary">Ejecutor:</span>
                    <p className="text-text-secondary">{pu.ejecutor}</p>
                  </div>
                )}
              </div>

              {pu.casos && pu.casos.length > 0 && (
                <div>
                  <span className="font-semibold text-text-primary">Casos de Prueba:</span>
                  <ul className="list-disc list-inside text-text-secondary mt-1">
                    {pu.casos.map((caso, idx) => (
                      <li key={idx}>
                        {caso.nombre}
                        <span className={`ml-2 text-xs ${
                          caso.estado === 'Aprobado' ? 'text-accent-green' :
                          caso.estado === 'Rechazado' ? 'text-accent-red' :
                          'text-accent-yellow'
                        }`}>
                          ({caso.estado})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-text-muted">No se incluirán pruebas unitarias</p>
          )}
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Card padding="md" className="bg-accent-purple/10 border-accent-purple">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">
              ¿Todo listo para generar?
            </h3>
            <p className="text-sm text-text-secondary">
              Se generarán los archivos Excel (FBD, FDA) y Word (PU) con la información ingresada.
              Los archivos se descargarán automáticamente en tu carpeta de Descargas.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleGenerate}
            isLoading={isGenerating}
            disabled={!basicInfo}
          >
            🚀 Generar Archivos FR
          </Button>
        </div>
      </Card>

      {/* Info Card */}
      <Card padding="md" className="bg-bg-primary">
        <div className="flex gap-4">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              Archivos que se generarán
            </h3>
            <ul className="text-sm text-text-secondary list-disc list-inside space-y-1">
              {basicInfo?.ambientes.map(ambiente => {
                const ambCode = ambiente === 'QA' ? 'QA' : 'PRD';
                return (
                  <React.Fragment key={ambiente}>
                    {hasFBD && <li>FR_{basicInfo.cdpsp}_FBD_{ambCode}.xlsx</li>}
                    {hasFDA && <li>FR_{basicInfo.cdpsp}_FDA_{ambCode}.xlsx</li>}
                    {hasPU && <li>{basicInfo.cdpsp}_PU_{ambCode}.docx</li>}
                  </React.Fragment>
                );
              })}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Step5Summary;
