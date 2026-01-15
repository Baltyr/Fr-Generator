import React, { useState } from 'react';
import { useConfigStore } from '@/stores/configStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { ConfiguracionGuardada } from '@/types';

export const UserDataConfig: React.FC = () => {
  const { config, updateConfig } = useConfigStore();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    solicitante: {
      nombre: { valor: config?.solicitante.nombre.valor || '', recordar: config?.solicitante.nombre.recordar || false },
      area: { valor: config?.solicitante.area.valor || '', recordar: config?.solicitante.area.recordar || false },
      telefono: { valor: config?.solicitante.telefono.valor || '', recordar: config?.solicitante.telefono.recordar || false },
    },
    servidores: {
      tipo: { valor: config?.servidores.tipo.valor || '', recordar: config?.servidores.tipo.recordar || false },
      urlQA: { valor: config?.servidores.urlQA.valor || '', recordar: config?.servidores.urlQA.recordar || false },
      urlPROD: { valor: config?.servidores.urlPROD.valor || '', recordar: config?.servidores.urlPROD.recordar || false },
      baseDatosPorDefecto: { valor: config?.servidores.baseDatosPorDefecto.valor || '', recordar: config?.servidores.baseDatosPorDefecto.recordar || false },
    },
    urls: {
      organizacionGitHub: { valor: config?.urls.organizacionGitHub.valor || '', recordar: config?.urls.organizacionGitHub.recordar || false },
      organizacionGitLab: { valor: config?.urls.organizacionGitLab.valor || '', recordar: config?.urls.organizacionGitLab.recordar || false },
      namespacePorDefecto: { valor: config?.urls.namespacePorDefecto.valor || '', recordar: config?.urls.namespacePorDefecto.recordar || false },
    },
    fda: {
      componentePorDefecto: { valor: config?.fda.componentePorDefecto.valor || '', recordar: config?.fda.componentePorDefecto.recordar || false },
      actividadQA: { valor: config?.fda.actividadQA.valor || '', recordar: config?.fda.actividadQA.recordar || false },
      actividadPROD: { valor: config?.fda.actividadPROD.valor || '', recordar: config?.fda.actividadPROD.recordar || false },
    },
    pu: {
      tipoPrueba: { valor: config?.pu.tipoPrueba.valor || '', recordar: config?.pu.tipoPrueba.recordar || false },
      ejecutorPrueba: { valor: config?.pu.ejecutorPrueba.valor || '', recordar: config?.pu.ejecutorPrueba.recordar || false },
    },
    fallback: {
      complejidad: { valor: config?.fallback.complejidad.valor || '', recordar: config?.fallback.complejidad.recordar || false },
      desarrollador: { valor: config?.fallback.desarrollador.valor || '', recordar: config?.fallback.desarrollador.recordar || false },
      jefatura: { valor: config?.fallback.jefatura.valor || '', recordar: config?.fallback.jefatura.recordar || false },
      tiempoResolucion: { valor: config?.fallback.tiempoResolucion.valor || '', recordar: config?.fallback.tiempoResolucion.recordar || false },
    },
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateConfig(formData as Partial<ConfiguracionGuardada>);
      alert('✅ Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      alert('❌ Error al guardar configuración');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Datos del Usuario
        </h2>
        <p className="text-text-secondary">
          Configura los valores por defecto para auto-rellenar los formularios.
          Marca "Recordar" para que el campo se complete automáticamente.
        </p>
      </div>

      {/* Solicitante */}
      <Card>
        <CardHeader>
          <CardTitle>👤 Información del Solicitante</CardTitle>
          <CardDescription>Datos de quien solicita el FR</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Nombre completo"
                value={formData.solicitante.nombre.valor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  solicitante: {
                    ...prev.solicitante,
                    nombre: { ...prev.solicitante.nombre, valor: e.target.value }
                  }
                }))}
                placeholder="Juan Pérez"
              />
              <Checkbox
                label="Recordar este valor"
                checked={formData.solicitante.nombre.recordar}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  solicitante: {
                    ...prev.solicitante,
                    nombre: { ...prev.solicitante.nombre, recordar: e.target.checked }
                  }
                }))}
                className="mt-2"
              />
            </div>

            <div>
              <Input
                label="Área"
                value={formData.solicitante.area.valor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  solicitante: {
                    ...prev.solicitante,
                    area: { ...prev.solicitante.area, valor: e.target.value }
                  }
                }))}
                placeholder="TI - Desarrollo"
              />
              <Checkbox
                label="Recordar este valor"
                checked={formData.solicitante.area.recordar}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  solicitante: {
                    ...prev.solicitante,
                    area: { ...prev.solicitante.area, recordar: e.target.checked }
                  }
                }))}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Input
              label="Teléfono"
              value={formData.solicitante.telefono.valor}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                solicitante: {
                  ...prev.solicitante,
                  telefono: { ...prev.solicitante.telefono, valor: e.target.value }
                }
              }))}
              placeholder="+56 9 1234 5678"
            />
            <Checkbox
              label="Recordar este valor"
              checked={formData.solicitante.telefono.recordar}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                solicitante: {
                  ...prev.solicitante,
                  telefono: { ...prev.solicitante.telefono, recordar: e.target.checked }
                }
              }))}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Servidores */}
      <Card>
        <CardHeader>
          <CardTitle>🖥️ Configuración de Servidores</CardTitle>
          <CardDescription>URLs y configuración de bases de datos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Tipo de servidor"
                value={formData.servidores.tipo.valor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  servidores: {
                    ...prev.servidores,
                    tipo: { ...prev.servidores.tipo, valor: e.target.value }
                  }
                }))}
                placeholder="Oracle, SQL Server, PostgreSQL"
              />
              <Checkbox
                label="Recordar este valor"
                checked={formData.servidores.tipo.recordar}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  servidores: {
                    ...prev.servidores,
                    tipo: { ...prev.servidores.tipo, recordar: e.target.checked }
                  }
                }))}
                className="mt-2"
              />
            </div>

            <div>
              <Input
                label="Base de datos por defecto"
                value={formData.servidores.baseDatosPorDefecto.valor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  servidores: {
                    ...prev.servidores,
                    baseDatosPorDefecto: { ...prev.servidores.baseDatosPorDefecto, valor: e.target.value }
                  }
                }))}
                placeholder="PROD_DB"
              />
              <Checkbox
                label="Recordar este valor"
                checked={formData.servidores.baseDatosPorDefecto.recordar}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  servidores: {
                    ...prev.servidores,
                    baseDatosPorDefecto: { ...prev.servidores.baseDatosPorDefecto, recordar: e.target.checked }
                  }
                }))}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Input
              label="URL QA"
              value={formData.servidores.urlQA.valor}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                servidores: {
                  ...prev.servidores,
                  urlQA: { ...prev.servidores.urlQA, valor: e.target.value }
                }
              }))}
              placeholder="https://qa-server.example.com"
            />
            <Checkbox
              label="Recordar este valor"
              checked={formData.servidores.urlQA.recordar}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                servidores: {
                  ...prev.servidores,
                  urlQA: { ...prev.servidores.urlQA, recordar: e.target.checked }
                }
              }))}
              className="mt-2"
            />
          </div>

          <div>
            <Input
              label="URL PROD"
              value={formData.servidores.urlPROD.valor}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                servidores: {
                  ...prev.servidores,
                  urlPROD: { ...prev.servidores.urlPROD, valor: e.target.value }
                }
              }))}
              placeholder="https://prod-server.example.com"
            />
            <Checkbox
              label="Recordar este valor"
              checked={formData.servidores.urlPROD.recordar}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                servidores: {
                  ...prev.servidores,
                  urlPROD: { ...prev.servidores.urlPROD, recordar: e.target.checked }
                }
              }))}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          isLoading={isSaving}
        >
          💾 Guardar configuración
        </Button>
      </div>
    </div>
  );
};

export default UserDataConfig;
