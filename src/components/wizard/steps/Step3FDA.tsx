import React, { useEffect, useState } from 'react';
import { useWizardStore } from '@/stores/wizardStore';
import { useConfigStore } from '@/stores/configStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ArchivoModificado } from '@/types';

export const Step3FDA: React.FC = () => {
  const { formData, updateFDA } = useWizardStore();
  const { config } = useConfigStore();

  const [localData, setLocalData] = useState({
    componente: formData.fda?.componente || config?.fda.componentePorDefecto.valor || '',
    urlRepositorio: formData.fda?.urlRepositorio || '',
    branch: formData.fda?.branch || 'main',
    archivos: formData.fda?.archivos || [] as ArchivoModificado[],
    observaciones: formData.fda?.observaciones || '',
  });

  // Auto-save to store
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFDA({
        componente: localData.componente,
        urlRepositorio: localData.urlRepositorio,
        branch: localData.branch,
        archivos: localData.archivos,
        observaciones: localData.observaciones,
      } as any);
    }, 500);

    return () => clearTimeout(timer);
  }, [localData, updateFDA]);

  // Archivo handling
  const addArchivo = () => {
    const newArchivo: ArchivoModificado = {
      id: Date.now().toString(),
      ruta: '',
      tipo: 'Modificado',
      descripcion: '',
    };
    setLocalData(prev => ({
      ...prev,
      archivos: [...prev.archivos, newArchivo],
    }));
  };

  const updateArchivo = (id: string, field: keyof ArchivoModificado, value: any) => {
    setLocalData(prev => ({
      ...prev,
      archivos: prev.archivos.map(archivo =>
        archivo.id === id ? { ...archivo, [field]: value } : archivo
      ),
    }));
  };

  const removeArchivo = (id: string) => {
    setLocalData(prev => ({
      ...prev,
      archivos: prev.archivos.filter(archivo => archivo.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          📈 FDA - Formato de Aplicaciones
        </h2>
        <p className="text-text-secondary">
          Define los cambios en el código fuente de la aplicación.
        </p>
      </div>

      {/* Información General */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Componente</CardTitle>
          <CardDescription>Componente y repositorio afectado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Componente"
            placeholder="Frontend, Backend, API, etc."
            value={localData.componente}
            onChange={(e) => setLocalData(prev => ({ ...prev, componente: e.target.value }))}
            helperText="Nombre del componente o aplicación"
            required
          />

          <Input
            label="URL del Repositorio"
            placeholder="https://github.com/organization/repo"
            value={localData.urlRepositorio}
            onChange={(e) => setLocalData(prev => ({ ...prev, urlRepositorio: e.target.value }))}
            helperText="URL completa del repositorio Git"
          />

          <Input
            label="Branch"
            placeholder="main, develop, feature/nueva-funcionalidad"
            value={localData.branch}
            onChange={(e) => setLocalData(prev => ({ ...prev, branch: e.target.value }))}
            helperText="Rama donde se encuentran los cambios"
          />
        </CardContent>
      </Card>

      {/* Archivos Modificados */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Archivos Modificados</CardTitle>
              <CardDescription>
                Lista de archivos creados, modificados o eliminados
              </CardDescription>
            </div>
            <Button variant="secondary" size="sm" onClick={addArchivo}>
              ➕ Agregar Archivo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {localData.archivos.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <p className="text-text-muted mb-2">No hay archivos agregados</p>
              <Button variant="ghost" size="sm" onClick={addArchivo}>
                ➕ Agregar primer archivo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {localData.archivos.map((archivo, index) => (
                <Card key={archivo.id} padding="md" className="bg-bg-primary">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-sm font-semibold text-accent-purple">
                      Archivo #{index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArchivo(archivo.id)}
                    >
                      🗑️
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Ruta del archivo"
                      placeholder="src/components/Usuario.tsx"
                      value={archivo.ruta}
                      onChange={(e) => updateArchivo(archivo.id, 'ruta', e.target.value)}
                      helperText="Ruta relativa desde la raíz del proyecto"
                      required
                    />

                    <Select
                      label="Tipo de cambio"
                      value={archivo.tipo}
                      onChange={(e) => updateArchivo(archivo.id, 'tipo', e.target.value as any)}
                      options={[
                        { value: 'Nuevo', label: '🆕 Nuevo' },
                        { value: 'Modificado', label: '✏️ Modificado' },
                        { value: 'Eliminado', label: '🗑️ Eliminado' },
                      ]}
                      required
                    />

                    <Input
                      label="Descripción del cambio"
                      placeholder="Se agregó validación de email"
                      value={archivo.descripcion}
                      onChange={(e) => updateArchivo(archivo.id, 'descripcion', e.target.value)}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Observaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Observaciones</CardTitle>
          <CardDescription>Notas adicionales sobre los cambios</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full px-4 py-2.5 bg-bg-card border-2 border-border rounded-lg text-text-primary placeholder-text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:border-accent-purple focus:ring-accent-purple resize-vertical min-h-[100px]"
            placeholder="Dependencias, configuraciones necesarias, instrucciones de despliegue, etc."
            value={localData.observaciones}
            onChange={(e) => setLocalData(prev => ({ ...prev, observaciones: e.target.value }))}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card padding="md" className="bg-bg-primary">
        <div className="flex gap-4">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              Tip: Documenta los cambios
            </h3>
            <p className="text-sm text-text-secondary">
              Asegúrate de incluir todos los archivos relevantes y describir claramente
              cada cambio para facilitar la revisión y el despliegue.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Step3FDA;
