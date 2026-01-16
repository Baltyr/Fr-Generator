import React, { useEffect, useState } from 'react';
import { useWizardStore } from '@/stores/wizardStore';
import { useConfigStore } from '@/stores/configStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ScriptSQL, StoredProcedure } from '@/types';

export const Step2FBD: React.FC = () => {
  const { formData, updateFBD } = useWizardStore();
  const { config } = useConfigStore();

  const [localData, setLocalData] = useState({
    baseDatos: formData.fbd?.baseDatos || config?.servidores.baseDatosPorDefecto.valor || '',
    esquema: formData.fbd?.esquema || '',
    scripts: formData.fbd?.scripts || [] as ScriptSQL[],
    storedProcedures: formData.fbd?.storedProcedures || [] as StoredProcedure[],
    observaciones: formData.fbd?.observaciones || '',
  });

  // Auto-save to store
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFBD({
        baseDatos: localData.baseDatos,
        esquema: localData.esquema,
        scripts: localData.scripts,
        storedProcedures: localData.storedProcedures,
        observaciones: localData.observaciones,
      } as any);
    }, 500);

    return () => clearTimeout(timer);
  }, [localData, updateFBD]);

  // Script handling
  const addScript = () => {
    const newScript: ScriptSQL = {
      id: Date.now().toString(),
      nombre: '',
      tipo: 'SELECT',
      descripcion: '',
      sql: '',
      orden: localData.scripts.length + 1,
    };
    setLocalData(prev => ({
      ...prev,
      scripts: [...prev.scripts, newScript],
    }));
  };

  const updateScript = (id: string, field: keyof ScriptSQL, value: any) => {
    setLocalData(prev => ({
      ...prev,
      scripts: prev.scripts.map(script =>
        script.id === id ? { ...script, [field]: value } : script
      ),
    }));
  };

  const removeScript = (id: string) => {
    setLocalData(prev => ({
      ...prev,
      scripts: prev.scripts.filter(script => script.id !== id),
    }));
  };

  // Stored Procedure handling
  const addStoredProcedure = () => {
    const newSP: StoredProcedure = {
      id: Date.now().toString(),
      nombre: '',
      descripcion: '',
      parametros: [],
      orden: localData.storedProcedures.length + 1,
    };
    setLocalData(prev => ({
      ...prev,
      storedProcedures: [...prev.storedProcedures, newSP],
    }));
  };

  const updateStoredProcedure = (id: string, field: keyof StoredProcedure, value: any) => {
    setLocalData(prev => ({
      ...prev,
      storedProcedures: prev.storedProcedures.map(sp =>
        sp.id === id ? { ...sp, [field]: value } : sp
      ),
    }));
  };

  const removeStoredProcedure = (id: string) => {
    setLocalData(prev => ({
      ...prev,
      storedProcedures: prev.storedProcedures.filter(sp => sp.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          📊 FBD - Formato de Base de Datos
        </h2>
        <p className="text-text-secondary">
          Define los scripts SQL y stored procedures para los cambios de base de datos.
        </p>
      </div>

      {/* Información General */}
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>Base de datos y esquema objetivo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Base de Datos"
              placeholder="PROD_DB"
              value={localData.baseDatos}
              onChange={(e) => setLocalData(prev => ({ ...prev, baseDatos: e.target.value }))}
              helperText="Base de datos donde se ejecutarán los scripts"
              required
            />

            <Input
              label="Esquema"
              placeholder="dbo, public, etc."
              value={localData.esquema}
              onChange={(e) => setLocalData(prev => ({ ...prev, esquema: e.target.value }))}
              helperText="Esquema de la base de datos"
            />
          </div>
        </CardContent>
      </Card>

      {/* Scripts SQL */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Scripts SQL</CardTitle>
              <CardDescription>
                Scripts DDL (CREATE, ALTER, DROP) o DML (INSERT, UPDATE, DELETE)
              </CardDescription>
            </div>
            <Button variant="secondary" size="sm" onClick={addScript}>
              ➕ Agregar Script
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {localData.scripts.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <p className="text-text-muted mb-2">No hay scripts agregados</p>
              <Button variant="ghost" size="sm" onClick={addScript}>
                ➕ Agregar primer script
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {localData.scripts.map((script, index) => (
                <Card key={script.id} padding="md" className="bg-bg-primary">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-sm font-semibold text-accent-purple">
                      Script #{index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeScript(script.id)}
                    >
                      🗑️
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Nombre del script"
                        placeholder="crear_tabla_usuarios"
                        value={script.nombre}
                        onChange={(e) => updateScript(script.id, 'nombre', e.target.value)}
                        required
                      />

                      <Select
                        label="Tipo de script"
                        value={script.tipo}
                        onChange={(e) => updateScript(script.id, 'tipo', e.target.value)}
                        options={[
                          { value: 'SELECT', label: 'SELECT' },
                          { value: 'INSERT', label: 'INSERT' },
                          { value: 'UPDATE', label: 'UPDATE' },
                          { value: 'DELETE', label: 'DELETE' },
                          { value: 'CREATE', label: 'CREATE' },
                          { value: 'ALTER', label: 'ALTER' },
                          { value: 'DROP', label: 'DROP' },
                        ]}
                        required
                      />
                    </div>

                    <Input
                      label="Descripción"
                      placeholder="Descripción del propósito del script"
                      value={script.descripcion}
                      onChange={(e) => updateScript(script.id, 'descripcion', e.target.value)}
                    />

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        SQL
                        <span className="text-accent-red ml-1">*</span>
                      </label>
                      <textarea
                        className="w-full px-4 py-2.5 bg-bg-card border-2 border-border rounded-lg text-text-primary placeholder-text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:border-accent-purple focus:ring-accent-purple resize-vertical min-h-[120px] font-mono text-sm"
                        placeholder="CREATE TABLE usuarios (
  id INT PRIMARY KEY,
  nombre VARCHAR(100)
);"
                        value={script.sql}
                        onChange={(e) => updateScript(script.id, 'sql', e.target.value)}
                        rows={6}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stored Procedures */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Stored Procedures</CardTitle>
              <CardDescription>
                Procedimientos almacenados a crear o modificar
              </CardDescription>
            </div>
            <Button variant="secondary" size="sm" onClick={addStoredProcedure}>
              ➕ Agregar SP
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {localData.storedProcedures.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
              <p className="text-text-muted mb-2">No hay stored procedures agregados</p>
              <Button variant="ghost" size="sm" onClick={addStoredProcedure}>
                ➕ Agregar primer SP
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {localData.storedProcedures.map((sp, index) => (
                <Card key={sp.id} padding="md" className="bg-bg-primary">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-sm font-semibold text-accent-purple">
                      Stored Procedure #{index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStoredProcedure(sp.id)}
                    >
                      🗑️
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Nombre del SP"
                      placeholder="sp_crear_usuario"
                      value={sp.nombre}
                      onChange={(e) => updateStoredProcedure(sp.id, 'nombre', e.target.value)}
                      required
                    />

                    <Input
                      label="Descripción"
                      placeholder="Descripción del stored procedure"
                      value={sp.descripcion}
                      onChange={(e) => updateStoredProcedure(sp.id, 'descripcion', e.target.value)}
                    />

                    <Input
                      label="Parámetros"
                      placeholder="@nombre VARCHAR(100), @edad INT"
                      value={sp.parametros?.join(', ') || ''}
                      onChange={(e) => {
                        const params = e.target.value.split(',').map(p => p.trim()).filter(p => p);
                        updateStoredProcedure(sp.id, 'parametros', params);
                      }}
                      helperText="Separados por comas"
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
          <CardDescription>Notas adicionales sobre los cambios de BD</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full px-4 py-2.5 bg-bg-card border-2 border-border rounded-lg text-text-primary placeholder-text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:border-accent-purple focus:ring-accent-purple resize-vertical min-h-[100px]"
            placeholder="Notas, precauciones, dependencias, etc."
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
              Tip: Orden de ejecución
            </h3>
            <p className="text-sm text-text-secondary">
              Los scripts y stored procedures se ejecutarán en el orden en que los agregaste.
              Asegúrate de que las dependencias estén en el orden correcto.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Step2FBD;
