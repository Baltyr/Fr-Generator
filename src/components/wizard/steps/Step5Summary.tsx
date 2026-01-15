import React, { useState } from 'react';
import { useWizardStore } from '@/stores/wizardStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const Step5Summary: React.FC = () => {
  const { formData } = useWizardStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // TODO: Implement file generation
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate
      alert('✅ Archivos FR generados exitosamente!\n\nEsta funcionalidad se implementará próximamente.');
    } catch (error) {
      console.error('Error al generar archivos:', error);
      alert('❌ Error al generar archivos FR');
    } finally {
      setIsGenerating(false);
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
              Próximamente: Generación de archivos
            </h3>
            <p className="text-sm text-text-secondary">
              La funcionalidad de generación de archivos Excel y Word se implementará
              en las próximas fases del proyecto. Por ahora puedes revisar el resumen
              y validar que toda la información esté correcta.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Step5Summary;
