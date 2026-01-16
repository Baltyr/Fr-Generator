import React, { useEffect, useState } from 'react';
import { StorageService } from '@/services/storageService';
import { HistorialFR, Epica } from '@/types/config.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const HomePage: React.FC = () => {
  const [history, setHistory] = useState<HistorialFR[]>([]);
  const [epicas, setEpicas] = useState<Epica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEpica, setSelectedEpica] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [historyData, epicasData] = await Promise.all([
        StorageService.getHistory(),
        StorageService.getEpicas(),
      ]);
      setHistory(historyData);
      setEpicas(epicasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Agrupar FRs por épica
  const getFRsByEpica = () => {
    const grouped: Record<string, HistorialFR[]> = {
      'Sin épica': history.filter(fr => !fr.epica),
    };

    epicas.forEach(epica => {
      grouped[epica.nombre] = history.filter(fr => fr.epica === epica.nombre);
    });

    return grouped;
  };

  const groupedFRs = getFRsByEpica();
  const epicasWithFRs = Object.entries(groupedFRs).filter(([_, frs]) => frs.length > 0);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  const handleOpenFolder = (rutaCarpeta: string) => {
    // TODO: Implementar apertura de carpeta con Tauri
    console.log('Abrir carpeta:', rutaCarpeta);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            🏠 Inicio - FRs Generadas
          </h1>
          <p className="text-text-secondary">
            {history.length} FR{history.length !== 1 ? 's' : ''} generada{history.length !== 1 ? 's' : ''} organizadas en {epicas.length} épica{epicas.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-accent-purple mb-1">
                {history.length}
              </div>
              <div className="text-sm text-text-muted">Total FRs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-accent-blue mb-1">
                {epicas.length}
              </div>
              <div className="text-sm text-text-muted">Épicas activas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-accent-green mb-1">
                {history.filter(fr => fr.fechaCreacion > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-sm text-text-muted">Últimos 7 días</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de FRs por épica */}
        {epicasWithFRs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No hay FRs generadas aún
              </h3>
              <p className="text-text-muted mb-6">
                Crea tu primera FR usando el wizard
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {epicasWithFRs.map(([epicaNombre, frs]) => (
              <Card key={epicaNombre}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {epicaNombre === 'Sin épica' ? (
                        <span className="text-2xl">📄</span>
                      ) : (
                        <span className="text-2xl">📌</span>
                      )}
                      <div>
                        <CardTitle>{epicaNombre}</CardTitle>
                        <p className="text-sm text-text-muted mt-1">
                          {frs.length} FR{frs.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    {epicaNombre !== 'Sin épica' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedEpica(selectedEpica === epicaNombre ? null : epicaNombre)}
                      >
                        {selectedEpica === epicaNombre ? '▼' : '▶'}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                {(selectedEpica === epicaNombre || epicaNombre === 'Sin épica' || selectedEpica === null) && (
                  <CardContent>
                    <div className="space-y-3">
                      {frs.map((fr) => (
                        <div
                          key={fr.id}
                          className="p-4 bg-bg-secondary rounded-lg hover:bg-bg-secondary/80 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-text-primary">
                                  {fr.cdpsp}
                                </h4>
                                <div className="flex gap-2">
                                  {fr.ambientes.map((amb) => (
                                    <React.Fragment key={amb}>
                                      {getAmbienteBadge(amb)}
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-text-muted mb-2">
                                <span>📅 {formatDate(fr.fechaCreacion)}</span>
                                <span>📁 {fr.archivosGenerados.length} archivos</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {fr.tiposFR.map((tipo) => (
                                  <span
                                    key={tipo}
                                    className="px-2 py-1 bg-accent-blue/20 text-accent-blue rounded text-xs font-medium"
                                  >
                                    {tipo}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenFolder(fr.rutaCarpeta)}
                              title="Abrir carpeta"
                            >
                              📂
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
