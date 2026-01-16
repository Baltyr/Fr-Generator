import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmModal } from '@/components/ui/Modal';
import { StorageService } from '@/services/storageService';
import { HistorialFR } from '@/types/config.types';
import { toast } from '@/stores/toastStore';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistorialFR[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistorialFR[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<HistorialFR | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredHistory(history);
    } else {
      const filtered = history.filter(item =>
        item.cdpsp.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fechaCreacion.toString().includes(searchTerm)
      );
      setFilteredHistory(filtered);
    }
  }, [searchTerm, history]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const historyData = await StorageService.getHistory();
      setHistory(historyData);
      setFilteredHistory(historyData);
    } catch (error) {
      console.error('Error al cargar historial:', error);
      toast.error('Error', 'No se pudo cargar el historial');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (item: HistorialFR) => {
    try {
      await StorageService.removeFromHistory(item.id);
      toast.success('Eliminado', 'El registro fue eliminado del historial');
      await loadHistory();
      setShowDeleteConfirm(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error('Error', 'No se pudo eliminar el registro');
    }
  };

  const handleClearHistory = async () => {
    try {
      await StorageService.clearHistory();
      toast.success('Limpiado', 'Todo el historial fue eliminado');
      await loadHistory();
    } catch (error) {
      console.error('Error al limpiar historial:', error);
      toast.error('Error', 'No se pudo limpiar el historial');
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAmbienteBadge = (ambiente: 'QA' | 'PROD') => {
    return ambiente === 'QA' ? (
      <span className="px-2 py-0.5 bg-accent-yellow/20 text-accent-yellow rounded text-xs font-semibold">
        QA
      </span>
    ) : (
      <span className="px-2 py-0.5 bg-accent-green/20 text-accent-green rounded text-xs font-semibold">
        PROD
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            📜 Historial de FRs
          </h1>
          <p className="text-text-secondary">
            Últimas {history.length} FRs generadas
          </p>
        </div>

        {/* Search and Actions */}
        <div className="mb-6 flex gap-4 items-center">
          <div className="flex-1">
            <Input
              placeholder="Buscar por CDPSP o fecha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          {history.length > 0 && (
            <Button
              variant="danger"
              onClick={handleClearHistory}
            >
              🗑️ Limpiar Todo
            </Button>
          )}
        </div>

        {/* History List */}
        {isLoading ? (
          <Card>
            <CardContent>
              <div className="text-center py-12 text-text-muted">
                Cargando historial...
              </div>
            </CardContent>
          </Card>
        ) : filteredHistory.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {searchTerm ? 'No se encontraron resultados' : 'No hay FRs en el historial'}
                </h3>
                <p className="text-text-muted">
                  {searchTerm ? 'Intenta con otro término de búsqueda' : 'Genera tu primer FR para verlo aquí'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <Card key={item.id} hover>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-text-primary">
                          {item.cdpsp}
                        </h3>
                        {item.epica && (
                          <span className="px-2 py-1 bg-accent-purple/20 text-accent-purple rounded-full text-xs font-semibold">
                            📌 {item.epica}
                          </span>
                        )}
                        <div className="flex gap-2">
                          {item.ambientes.map((amb) => (
                            <React.Fragment key={amb}>
                              {getAmbienteBadge(amb)}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-3">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(item.fechaCreacion)}
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {item.archivosGenerados.length} archivo{item.archivosGenerados.length !== 1 ? 's' : ''}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {item.archivosGenerados.map((file, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-bg-secondary text-text-secondary rounded text-xs font-mono"
                          >
                            {file}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedItem && (
          <ConfirmModal
            isOpen={showDeleteConfirm}
            onClose={() => {
              setShowDeleteConfirm(false);
              setSelectedItem(null);
            }}
            title="¿Eliminar del historial?"
            message={`¿Estás seguro de que deseas eliminar "${selectedItem.cdpsp}" del historial? Esta acción no se puede deshacer.`}
            confirmText="Eliminar"
            cancelText="Cancelar"
            variant="danger"
            onConfirm={() => handleDelete(selectedItem)}
          />
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
