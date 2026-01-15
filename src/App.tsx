import { useState } from 'react';

function App() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-accent-purple mb-4">
            🚀 FR Generator
          </h1>
          <p className="text-text-secondary text-lg">
            Generador automático de archivos FR para Jira
          </p>
          <p className="text-text-muted text-sm mt-2">
            Proyecto inicializado correctamente
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
