import React, { useState } from 'react';
import { TemplatesConfig } from './TemplatesConfig';
import { UserDataConfig } from './UserDataConfig';

type SettingsTab = 'templates' | 'userdata' | 'advanced';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('templates');

  const tabs = [
    { id: 'templates' as const, label: 'Templates', icon: '📄' },
    { id: 'userdata' as const, label: 'Datos del Usuario', icon: '👤' },
    { id: 'advanced' as const, label: 'Avanzado', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            ⚙️ Configuración
          </h1>
          <p className="text-text-secondary">
            Personaliza tu aplicación FR Generator
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 text-sm font-medium rounded-t-lg
                transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-bg-card text-accent-purple border-b-2 border-accent-purple'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-card'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="transition-opacity duration-200">
          {activeTab === 'templates' && <TemplatesConfig />}
          {activeTab === 'userdata' && <UserDataConfig />}
          {activeTab === 'advanced' && (
            <div className="text-center py-12">
              <p className="text-text-muted">
                Opciones avanzadas próximamente...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
