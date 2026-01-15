import React, { useState } from 'react';
import { useConfigStore } from '@/stores/configStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';

type TemplateType = 'FBD' | 'FDA' | 'PU';

interface TemplateConfig {
  type: TemplateType;
  title: string;
  description: string;
  accept: string;
  icon: string;
}

const TEMPLATES: TemplateConfig[] = [
  {
    type: 'FBD',
    title: 'Template FBD',
    description: 'Formato de base de datos - Archivo Excel',
    accept: '.xlsx,.xls',
    icon: '📊',
  },
  {
    type: 'FDA',
    title: 'Template FDA',
    description: 'Formato de aplicaciones - Archivo Excel',
    accept: '.xlsx,.xls',
    icon: '📈',
  },
  {
    type: 'PU',
    title: 'Template PU',
    description: 'Pruebas unitarias - Documento Word',
    accept: '.docx,.doc',
    icon: '📝',
  },
];

export const TemplatesConfig: React.FC = () => {
  const { config, saveTemplate, deleteTemplate, hasTemplate } = useConfigStore();
  const [uploadingTemplate, setUploadingTemplate] = useState<TemplateType | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<TemplateType | null>(null);
  const [templateStates, setTemplateStates] = useState<Record<TemplateType, boolean>>({
    FBD: false,
    FDA: false,
    PU: false,
  });

  // Load template states on mount
  React.useEffect(() => {
    const loadStates = async () => {
      const states = await Promise.all([
        hasTemplate('FBD'),
        hasTemplate('FDA'),
        hasTemplate('PU'),
      ]);
      setTemplateStates({
        FBD: states[0],
        FDA: states[1],
        PU: states[2],
      });
    };
    loadStates();
  }, [hasTemplate]);

  const handleFileSelect = async (type: TemplateType, file: File) => {
    setUploadingTemplate(type);
    try {
      await saveTemplate(type, file);
      setTemplateStates(prev => ({ ...prev, [type]: true }));
      alert(`✅ Template ${type} guardado exitosamente`);
    } catch (error) {
      console.error(`Error al guardar template ${type}:`, error);
      alert(`❌ Error al guardar template ${type}`);
    } finally {
      setUploadingTemplate(null);
    }
  };

  const handleDeleteClick = (type: TemplateType) => {
    setTemplateToDelete(type);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return;

    try {
      await deleteTemplate(templateToDelete);
      setTemplateStates(prev => ({ ...prev, [templateToDelete]: false }));
      alert(`✅ Template ${templateToDelete} eliminado exitosamente`);
    } catch (error) {
      console.error(`Error al eliminar template ${templateToDelete}:`, error);
      alert(`❌ Error al eliminar template ${templateToDelete}`);
    } finally {
      setDeleteModalOpen(false);
      setTemplateToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Templates
        </h2>
        <p className="text-text-secondary">
          Carga tus plantillas Excel y Word personalizadas. Los archivos generados mantendrán
          el formato exacto de tus templates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((template) => {
          const hasFile = templateStates[template.type];
          const currentFileName = config?.templates[template.type.toLowerCase() as 'fbd' | 'fda' | 'pu'];
          const isUploading = uploadingTemplate === template.type;

          return (
            <Card key={template.type} padding="md">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{template.icon}</span>
                  <div>
                    <CardTitle className="text-base">{template.title}</CardTitle>
                    <CardDescription className="text-xs">{template.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <FileUpload
                  accept={template.accept}
                  maxSize={10}
                  onFileSelect={(file) => handleFileSelect(template.type, file)}
                  currentFileName={hasFile ? currentFileName || undefined : undefined}
                  helperText={`Formatos: ${template.accept}`}
                />

                {hasFile && (
                  <div className="mt-4 flex items-center justify-between p-3 bg-success-bg border border-accent-green rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-accent-green">✓</span>
                      <span className="text-sm text-text-secondary">Template cargado</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(template.type)}
                      disabled={isUploading}
                    >
                      🗑️ Eliminar
                    </Button>
                  </div>
                )}

                {isUploading && (
                  <div className="mt-3 text-center">
                    <div className="inline-flex items-center gap-2 text-sm text-text-muted">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-purple"></div>
                      Guardando...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      <Card padding="md" className="bg-bg-primary">
        <div className="flex gap-4">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              ¿Cómo funcionan los templates?
            </h3>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Los templates se almacenan localmente en tu navegador (IndexedDB)</li>
              <li>• La aplicación solo modifica los valores de las celdas, preservando todo el formato</li>
              <li>• Puedes actualizar un template subiendo un nuevo archivo</li>
              <li>• Los 3 templates son requeridos para generar FRs completas</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar template"
        message={`¿Estás seguro de que deseas eliminar el template ${templateToDelete}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

export default TemplatesConfig;
