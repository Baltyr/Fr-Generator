# FR Generator

Aplicación de escritorio para generar automáticamente archivos FR (FBD, FDA, PU) para solicitudes de pases a QA y Producción en Jira.

## 🚀 Características

- **100% Portable**: Ejecutable único sin necesidad de instalación
- **Basado en Templates**: Los usuarios cargan sus propias plantillas FR para preservar el formato exacto
- **Memoria de Campos**: Auto-completa datos usados frecuentemente
- **Funciona Offline**: No requiere internet después de la configuración inicial
- **Multi-ambiente**: Genera FRs para QA y Producción

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript + TailwindCSS
- **State Management**: Zustand
- **File Processing**: SheetJS (Excel) + docx.js (Word)
- **Desktop Framework**: Tauri
- **Build Tool**: Vite

## 📋 Prerequisitos

- Node.js 18+
- Rust (para Tauri)
- npm o yarn

## 🔧 Instalación para Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run tauri:dev

# Compilar para producción
npm run tauri:build
```

## 📦 Estructura del Proyecto

```
fr-generator/
├── src/                    # Código fuente React
│   ├── components/         # Componentes de UI
│   ├── hooks/             # React hooks personalizados
│   ├── services/          # Servicios (Excel, Word, Storage)
│   ├── stores/            # Zustand stores
│   ├── types/             # Definiciones de TypeScript
│   ├── utils/             # Utilidades
│   └── styles/            # Estilos globales
├── src-tauri/             # Código Rust de Tauri
└── public/                # Archivos estáticos
```

## 📖 Uso

1. **Primera Ejecución**: La aplicación te guiará para cargar tus templates (FBD, FDA, PU)
2. **Configuración**: Configura tus datos por defecto (nombre, área, servidores)
3. **Generar FR**: Usa el wizard para crear tus FRs paso a paso
4. **Resultado**: Los archivos se generan preservando el formato de tus templates

## 🎨 Características de la UI

- Tema oscuro moderno
- Wizard paso a paso intuitivo
- Validaciones en tiempo real
- Historial de FRs generadas
- Export/Import de configuración

## 📝 Licencia

Privado - Bupa Seguros

## 👤 Autor

Allan Bascur - Bupaverse Team
