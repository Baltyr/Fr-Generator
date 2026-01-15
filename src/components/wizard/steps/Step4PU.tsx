import React, { useEffect, useState } from 'react';
import { useWizardStore } from '@/stores/wizardStore';
import { useConfigStore } from '@/stores/configStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CasoPrueba } from '@/types';

export const Step4PU: React.FC = () => {
  const { formData, updatePU } = useWizardStore();
  const { config } = useConfigStore();

  const [localData, setLocalData] = useState({
    tipoPrueba: formData.pu?.tipoPrueba || config?.pu.tipoPrueba.valor || 'Unitaria',
    ejecutor: formData.pu?.ejecutor || config?.pu.ejecutorPrueba.valor || '',
    herramienta: formData.pu?.herramienta || '',
    casos: formData.pu?.casos || [] as CasoPrueba[],
    observaciones: formData.pu?.observaciones || '',
  });

  // Auto-save to store
  useEffect(() => {
    const timer = setTimeout(() => {
      updatePU({
        tipoPrueba: localData.tipoPrueba,
        ejecutor: localData.ejecutor,
        herramienta: localData.herramienta,
        casos: localData.casos,
        observaciones: localData.observaciones,
      } as any);
    }, 500);

    return () => clearTimeout(timer);
  }, [localData, updatePU]);

  // Caso de prueba handling
  const addCaso = () => {
    const newCaso: CasoPrueba = {
      id: Date.now().toString(),
      nombre: '',
      descripcion: '',
      precondiciones: '',
      pasos: [],
      resultadoEsperado: '',
      estado: 'Pendiente',
    };
    setLocalData(prev => ({
      ...prev,
      casos: [...prev.casos, newCaso],
    }));
  };

  const updateCaso = (id: string, field: keyof CasoPrueba, value: any) => {
    setLocalData(prev => ({
      ...prev,
      casos: prev.casos.map(caso =>
        caso.id === id ? { ...caso, [field]: value } : caso
      ),
    }));
  };

  const removeCaso = (id: string) => {
    setLocalData(prev => ({
      ...prev,
      casos: prev.casos.filter(caso => caso.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          📝 PU - Pruebas Unitarias
        </h2>
        <p className="text-text-secondary">
          Define los casos de prueba para validar los cambios realizados.
        </p>
      </div>

      {/* Información General */}
      <Card>
        <CardHeader>
          <CardTitle>Información de las Pruebas</CardTitle>
          <CardDescription>Tipo y herramientas de testing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Tipo de Prueba"
              value={localData.tipoPrueba}
              onChange={(e) => setLocalData(prev => ({ ...prev, tipoPrueba: e.target.value }))}
              options={[
                { value: 'Unitaria', label: 'Unitaria' },
                { value: 'Integración', label: 'Integración' },
                { value: 'Funcional', label: 'Funcional' },
                { value: 'E2E', label: 'End-to-End (E2E)' },
                { value: 'Regresión', label: 'Regresión' },
              ]}
              required
            />

            <Input
              label="Ejecutor de Pruebas"
              placeholder="Nombre del QA o desarrollador"
              value={localData.ejecutor}
              onChange={(e) => setLocalData(prev => ({ ...prev, ejecutor: e.target.value }))}
              helperText="Persona que ejecutará las pruebas"
            />
          </div>

          <Input
            label="Herramienta de Testing"
            placeholder="Jest, Pytest, Selenium, Postman, etc."
            value={localData.herramienta}
            onChange={(e) => setLocalData(prev => ({ ...prev, herramienta: e.target.value }))}
            helperText="Framework o herramienta utilizada"
          />
        </CardContent>
      </Card>

      {/* Casos de Prueba */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Casos de Prueba</CardTitle>
              <CardDescription>
                Define los escenarios a probar
              </CardDescription>
            </div>
            <Button variant="secondary" size="sm" onClick={addCaso}>
              ➕ Agregar Caso
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {localData.casos.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <p className="text-text-muted mb-2">No hay casos de prueba agregados</p>
              <Button variant="ghost" size="sm" onClick={addCaso}>
                ➕ Agregar primer caso de prueba
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {localData.casos.map((caso, index) => (
                <Card key={caso.id} padding="md" className="bg-bg-primary">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-sm font-semibold text-accent-purple">
                      Caso de Prueba #{index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCaso(caso.id)}
                    >
                      🗑️
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Nombre del caso"
                      placeholder="Validar creación de usuario"
                      value={caso.nombre}
                      onChange={(e) => updateCaso(caso.id, 'nombre', e.target.value)}
                      required
                    />

                    <Input
                      label="Descripción"
                      placeholder="Verificar que se puede crear un usuario correctamente"
                      value={caso.descripcion}
                      onChange={(e) => updateCaso(caso.id, 'descripcion', e.target.value)}
                    />

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Precondiciones
                      </label>
                      <textarea
                        className="w-full px-4 py-2.5 bg-bg-card border-2 border-border rounded-lg text-text-primary placeholder-text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:border-accent-purple focus:ring-accent-purple resize-vertical min-h-[80px]"
                        placeholder="- Usuario autenticado&#10;- Base de datos limpia"
                        value={caso.precondiciones}
                        onChange={(e) => updateCaso(caso.id, 'precondiciones', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Pasos para ejecutar
                      </label>
                      <textarea
                        className="w-full px-4 py-2.5 bg-bg-card border-2 border-border rounded-lg text-text-primary placeholder-text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:border-accent-purple focus:ring-accent-purple resize-vertical min-h-[100px]"
                        placeholder="1. Navegar a /usuarios/nuevo&#10;2. Completar formulario&#10;3. Click en Guardar"
                        value={caso.pasos?.join('\n') || ''}
                        onChange={(e) => {
                          const pasos = e.target.value.split('\n').filter(p => p.trim());
                          updateCaso(caso.id, 'pasos', pasos);
                        }}
                        rows={4}
                      />
                      <p className="text-xs text-text-muted mt-1">Un paso por línea</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Resultado Esperado
                      </label>
                      <textarea
                        className="w-full px-4 py-2.5 bg-bg-card border-2 border-border rounded-lg text-text-primary placeholder-text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:border-accent-purple focus:ring-accent-purple resize-vertical min-h-[80px]"
                        placeholder="Usuario creado exitosamente con mensaje de confirmación"
                        value={caso.resultadoEsperado}
                        onChange={(e) => updateCaso(caso.id, 'resultadoEsperado', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Select
                      label="Estado"
                      value={caso.estado}
                      onChange={(e) => updateCaso(caso.id, 'estado', e.target.value)}
                      options={[
                        { value: 'Pendiente', label: '⏳ Pendiente' },
                        { value: 'En Progreso', label: '🔄 En Progreso' },
                        { value: 'Aprobado', label: '✅ Aprobado' },
                        { value: 'Rechazado', label: '❌ Rechazado' },
                      ]}
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
          <CardDescription>Notas adicionales sobre las pruebas</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full px-4 py-2.5 bg-bg-card border-2 border-border rounded-lg text-text-primary placeholder-text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:border-accent-purple focus:ring-accent-purple resize-vertical min-h-[100px]"
            placeholder="Consideraciones especiales, ambientes de prueba necesarios, etc."
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
              Tip: Casos de prueba completos
            </h3>
            <p className="text-sm text-text-secondary">
              Define casos de prueba claros y detallados para asegurar que todas las funcionalidades
              sean validadas correctamente antes del despliegue.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Step4PU;
