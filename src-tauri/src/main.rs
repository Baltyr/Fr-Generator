// Prevents additional console window on Windows in release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use commands::{
    create_directory, copy_file, write_file, read_file,
    file_exists, open_folder
};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_directory,
            copy_file,
            write_file,
            read_file,
            file_exists,
            open_folder
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
