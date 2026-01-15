use std::fs;
use std::path::Path;

/// Crea un directorio (y subdirectorios si es necesario)
#[tauri::command]
pub fn create_directory(path: String) -> Result<(), String> {
    fs::create_dir_all(&path)
        .map_err(|e| format!("Error al crear directorio: {}", e))
}

/// Copia un archivo de origen a destino
#[tauri::command]
pub fn copy_file(src: String, dest: String) -> Result<(), String> {
    fs::copy(&src, &dest)
        .map_err(|e| format!("Error al copiar archivo: {}", e))?;
    Ok(())
}

/// Escribe datos binarios a un archivo
#[tauri::command]
pub fn write_file(path: String, contents: Vec<u8>) -> Result<(), String> {
    fs::write(&path, contents)
        .map_err(|e| format!("Error al escribir archivo: {}", e))
}

/// Lee un archivo y devuelve sus datos binarios
#[tauri::command]
pub fn read_file(path: String) -> Result<Vec<u8>, String> {
    fs::read(&path)
        .map_err(|e| format!("Error al leer archivo: {}", e))
}

/// Verifica si un archivo existe
#[tauri::command]
pub fn file_exists(path: String) -> bool {
    Path::new(&path).exists()
}

/// Abre una carpeta en el explorador del sistema
#[tauri::command]
pub fn open_folder(path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("Error al abrir carpeta: {}", e))?;
    }

    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("Error al abrir carpeta: {}", e))?;
    }

    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("Error al abrir carpeta: {}", e))?;
    }

    Ok(())
}
