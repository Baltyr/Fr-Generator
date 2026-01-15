# 🚀 FR Generator

Generador automático de archivos FR (FBD, FDA, PU) para solicitudes de pase en Jira.

## 📋 Características

- ✅ **100% Portable**: Aplicación de escritorio sin dependencias externas
- ✅ **Template-Based**: Usa tus propias plantillas Excel/Word preservando formato
- ✅ **Auto-completado**: Recuerda y rellena automáticamente datos frecuentes
- ✅ **Offline-First**: Funciona completamente sin internet
- ✅ **Multi-ambiente**: Genera archivos para QA y Producción
- ✅ **Dark Theme**: Interfaz moderna y profesional
- ✅ **Auto-guardado**: Progreso guardado automáticamente

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript + TailwindCSS
- **Desktop**: Tauri (Rust)
- **State Management**: Zustand
- **Storage**: IndexedDB (localforage)
- **Build Tool**: Vite
- **Peso**: ~10-15MB (vs ~150MB de Electron)

## 📦 Instalación

### Requisitos Previos

- Node.js 18+
- Rust (para desarrollo)

### Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run tauri:dev

# Build para producción
npm run tauri:build
```

## 🎯 Uso

### Primera Ejecución

1. **Setup Wizard** aparecerá automáticamente
2. **Carga tus templates** (FBD Excel, FDA Excel, PU Word)
3. **Configura tus datos** (nombre, área, etc.)
4. ¡Listo para generar FRs!

### Crear un FR

1. Click en **"➕ Nuevo FR"**
2. **Step 1**: Información básica (CDPSP, título, descripción)
3. **Step 2**: FBD - Scripts SQL y Stored Procedures (opcional)
4. **Step 3**: FDA - Archivos modificados (opcional)
5. **Step 4**: PU - Casos de prueba (opcional)
6. **Step 5**: Resumen y generación

### Configuración

- **Templates**: Cargar/actualizar plantillas Excel y Word
- **Datos del Usuario**: Configurar valores por defecto
- **Recordar**: Marca campos para auto-completado

## 📁 Estructura del Proyecto

```
Fr-Generator/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes reutilizables
│   │   ├── settings/        # Configuración y templates
│   │   └── wizard/          # Wizard de 5 pasos
│   ├── services/            # Servicios (storage, etc.)
│   ├── stores/              # Zustand stores
│   ├── styles/              # CSS global y tema
│   └── types/               # TypeScript definitions
├── src-tauri/               # Backend Rust
│   ├── src/
│   │   ├── commands.rs      # Comandos Tauri
│   │   └── main.rs
│   └── tauri.conf.json      # Configuración Tauri
└── package.json
```

## 🎨 Sistema de Notificaciones

```typescript
import { toast } from '@/stores/toastStore';

// Uso
toast.success('Título', 'Mensaje opcional');
toast.error('Error', 'Detalles del error');
toast.warning('Advertencia', 'Información importante');
toast.info('Info', 'Nota informativa', 6000);
```

## 🔧 Configuración Avanzada

### Templates

Los templates se almacenan en IndexedDB como Base64. La aplicación:
- Preserva todo el formato original
- Solo modifica valores de celdas/campos específicos
- Soporta `.xlsx`, `.xls` para Excel y `.docx` para Word

### Almacenamiento

- **IndexedDB**: Templates, configuración, historial
- **localStorage**: Progreso del wizard
- **Todo offline**: Sin necesidad de servidor

## 📊 Progreso del Proyecto

**Estado actual: ~80% completado**

### ✅ Completado
- [x] Infraestructura base (Tauri + React + TypeScript)
- [x] Componentes UI completos (8 componentes)
- [x] Sistema de storage (IndexedDB)
- [x] Stores de estado (Config, Wizard, Toast)
- [x] Wizard completo (5 pasos)
- [x] Sistema de configuración
- [x] First-run setup wizard
- [x] Sistema de notificaciones toast
- [x] Auto-guardado y validación
- [x] Dark theme

### ⏳ Pendiente
- [ ] Servicio de generación Excel (FBD, FDA)
- [ ] Servicio de generación Word (PU)
- [ ] Página de historial
- [ ] Export/Import configuración
- [ ] Testing completo
- [ ] Build del ejecutable Windows

## 🤝 Contribución

Este es un proyecto interno. Para sugerencias o bugs, contacta al equipo de desarrollo.

## 📝 Licencia

Uso interno - Todos los derechos reservados.

## 🔗 Links Útiles

- [Tauri Docs](https://tauri.app/)
- [React Docs](https://react.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [TailwindCSS](https://tailwindcss.com/)

---

**Versión**: 1.0.0
**Última actualización**: 2026-01-15
**Desarrollado con**: Claude Sonnet 4.5 🤖
