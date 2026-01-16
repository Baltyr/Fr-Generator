import React, { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useConfigStore } from '@/stores/configStore';
import { ConfiguracionGuardada } from '@/types/config.types';
import { toast } from '@/stores/toastStore';

export const ConfigExportImport: React.FC = () => {
  const { config, updateConfig } = useConfigStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (!config) {
      toast.error('Error', 'No hay configuración para exportar');
      return;
    }

    try {
      // Crear objeto de configuración sin los templates (son muy grandes)
      const exportData = {
        ...config,
        templates: {
          fbd: config.templates.fbd ? '(template guardado)' : null,
          fda: config.templates.fda ? '(template guardado)' : null,
          pu: config.templates.pu ? '(template guardado)' : null,
        },
        exportedAt: new Date().toISOString(),
        exportVersion: '1.0.0',
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `fr-generator-config-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(
        'Configuración exportada',
        'El archivo se descargó en tu carpeta de Descargas'
      );
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error(
        'Error al exportar',
        error instanceof Error ? error.message : 'Error desconocido'
      );
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedConfig = JSON.parse(text) as Partial<ConfiguracionGuardada>;

      // Validar estructura básica
      if (!importedConfig.id || !importedConfig.version) {
        throw new Error('El archivo no contiene una configuración válida');
      }

      // Eliminar campos que no se deben importar
      const { templates, exportedAt, exportVersion, ...configToImport } = importedConfig as any;

      // Actualizar configuración (sin sobrescribir templates)
      await updateConfig(configToImport);

      toast.success(
        'Configuración importada',
        'Los datos se importaron correctamente. Los templates no se modificaron.'
      );

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error al importar:', error);
      toast.error(
        'Error al importar',
        error instanceof Error ? error.message : 'Archivo inválido'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>📤 Exportar Configuración</CardTitle>
          <CardDescription>
            Descarga un archivo JSON con tu configuración actual (sin incluir los templates)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-bg-primary border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-text-primary mb-2">
                Se exportará:
              </h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Datos del solicitante</li>
                <li>• Configuración de servidores</li>
                <li>• URLs de repositorios</li>
                <li>• Configuración de FDA y PU</li>
                <li>• Valores de fallback</li>
                <li>• Carpeta de salida</li>
              </ul>
              <p className="text-xs text-text-muted mt-3">
                ⚠️ Los templates NO se exportan debido a su tamaño. Deberás cargarlos manualmente después de importar.
              </p>
            </div>

            <Button
              variant="primary"
              onClick={handleExport}
              disabled={!config}
            >
              📥 Descargar Configuración
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle>📥 Importar Configuración</CardTitle>
          <CardDescription>
            Carga un archivo JSON de configuración previamente exportado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-accent-yellow/10 border border-accent-yellow/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-accent-yellow mb-2">
                ⚠️ Advertencia
              </h4>
              <p className="text-sm text-text-secondary">
                Al importar una configuración, tus datos actuales serán sobrescritos.
                Los templates actuales no se modificarán.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />

            <Button
              variant="secondary"
              onClick={handleImportClick}
            >
              📂 Seleccionar archivo JSON
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card padding="md" className="bg-bg-primary">
        <div className="flex gap-4">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              Casos de uso
            </h3>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Backup de tu configuración antes de hacer cambios</li>
              <li>• Compartir configuración con tu equipo</li>
              <li>• Migrar configuración entre computadoras</li>
              <li>• Restaurar configuración anterior</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConfigExportImport;
