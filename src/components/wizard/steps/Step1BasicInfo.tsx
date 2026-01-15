import React, { useEffect, useState } from 'react';
import { useWizardStore } from '@/stores/wizardStore';
import { useConfigStore } from '@/stores/configStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';

export const Step1BasicInfo: React.FC = () => {
  const { formData, updateBasicInfo } = useWizardStore();
  const { config } = useConfigStore();

  const [localData, setLocalData] = useState({
    cdpsp: formData.basicInfo?.cdpsp || '',
    titulo: formData.basicInfo?.titulo || '',
    descripcion: formData.basicInfo?.descripcion || '',
    solicitante: formData.basicInfo?.solicitante || config?.solicitante.nombre.valor || '',
    area: formData.basicInfo?.area || config?.solicitante.area.valor || '',
    telefono: formData.basicInfo?.telefono || config?.solicitante.telefono.valor || '',
    ambientes: formData.basicInfo?.ambientes || ['QA', 'PROD'],
    fechaSolicitud: formData.basicInfo?.fechaSolicitud || new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-save to store on changes
  useEffect(() => {
    const timer = setTimeout(() => {
      updateBasicInfo(localData);
    }, 500);

    return () => clearTimeout(timer);
  }, [localData, updateBasicInfo]);

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'cdpsp':
        if (!value.trim()) return 'El CDPSP es obligatorio';
        if (!/^[A-Z0-9-]+$/.test(value)) return 'Solo letras mayúsculas, números y guiones';
        return '';
      case 'titulo':
        if (!value.trim()) return 'El título es obligatorio';
        if (value.length < 10) return 'Mínimo 10 caracteres';
        return '';
      case 'descripcion':
        if (!value.trim()) return 'La descripción es obligatoria';
        if (value.length < 20) return 'Mínimo 20 caracteres';
        return '';
      case 'solicitante':
        if (!value.trim()) return 'El nombre del solicitante es obligatorio';
        return '';
      case 'area':
        if (!value.trim()) return 'El área es obligatoria';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (field: string, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));

    // Validate on change
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleAmbienteToggle = (ambiente: 'QA' | 'PROD') => {
    setLocalData(prev => {
      const ambientes = prev.ambientes.includes(ambiente)
        ? prev.ambientes.filter(a => a !== ambiente)
        : [...prev.ambientes, ambiente];

      return { ...prev, ambientes };
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          📋 Información Básica del FR
        </h2>
        <p className="text-text-secondary">
          Completa la información general del formato de requerimiento.
          Los campos con <span className="text-accent-red">*</span> son obligatorios.
        </p>
      </div>

      {/* Información del FR */}
      <Card>
        <CardHeader>
          <CardTitle>Identificación del Requerimiento</CardTitle>
          <CardDescription>CDPSP y descripción general</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="CDPSP"
            placeholder="CDP-2024-001"
            value={localData.cdpsp}
            onChange={(e) => handleChange('cdpsp', e.target.value.toUpperCase())}
            error={errors.cdpsp}
            helperText="Código único del requerimiento (ej: CDP-2024-001)"
            required
          />

          <Input
            label="Título del requerimiento"
            placeholder="Implementación de nueva funcionalidad..."
            value={localData.titulo}
            onChange={(e) => handleChange('titulo', e.target.value)}
            error={errors.titulo}
            required
          />

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Descripción detallada
              <span className="text-accent-red ml-1">*</span>
            </label>
            <textarea
              className={`
                w-full px-4 py-2.5
                bg-bg-card border-2 rounded-lg
                text-text-primary placeholder-text-muted
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary
                resize-vertical min-h-[120px]
                ${errors.descripcion
                  ? 'border-accent-red focus:border-accent-red focus:ring-accent-red'
                  : 'border-border focus:border-accent-purple focus:ring-accent-purple'
                }
              `}
              placeholder="Describe el requerimiento en detalle..."
              value={localData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              rows={5}
            />
            {errors.descripcion && (
              <p className="mt-1.5 text-sm text-accent-red">{errors.descripcion}</p>
            )}
          </div>

          <Input
            label="Fecha de solicitud"
            type="date"
            value={localData.fechaSolicitud}
            onChange={(e) => handleChange('fechaSolicitud', e.target.value)}
            required
          />
        </CardContent>
      </Card>

      {/* Información del Solicitante */}
      <Card>
        <CardHeader>
          <CardTitle>Datos del Solicitante</CardTitle>
          <CardDescription>Información de contacto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre completo"
              placeholder="Juan Pérez"
              value={localData.solicitante}
              onChange={(e) => handleChange('solicitante', e.target.value)}
              error={errors.solicitante}
              required
            />

            <Input
              label="Área"
              placeholder="TI - Desarrollo"
              value={localData.area}
              onChange={(e) => handleChange('area', e.target.value)}
              error={errors.area}
              required
            />
          </div>

          <Input
            label="Teléfono"
            placeholder="+56 9 1234 5678"
            value={localData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            helperText="Opcional"
          />
        </CardContent>
      </Card>

      {/* Ambientes */}
      <Card>
        <CardHeader>
          <CardTitle>Ambientes de Despliegue</CardTitle>
          <CardDescription>Selecciona los ambientes donde se desplegará</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Checkbox
            id="ambiente-qa"
            label="QA (Ambiente de Pruebas)"
            description="Despliegue en ambiente de calidad/testing"
            checked={localData.ambientes.includes('QA')}
            onChange={() => handleAmbienteToggle('QA')}
          />

          <Checkbox
            id="ambiente-prod"
            label="PROD (Ambiente de Producción)"
            description="Despliegue en ambiente productivo"
            checked={localData.ambientes.includes('PROD')}
            onChange={() => handleAmbienteToggle('PROD')}
          />

          {localData.ambientes.length === 0 && (
            <p className="text-sm text-accent-red mt-2">
              Debes seleccionar al menos un ambiente
            </p>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card padding="md" className="bg-bg-primary">
        <div className="flex gap-4">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              Tip: Datos guardados automáticamente
            </h3>
            <p className="text-sm text-text-secondary">
              Los datos se guardan automáticamente mientras escribes. Si configuraste
              valores por defecto, se completarán automáticamente.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Step1BasicInfo;
