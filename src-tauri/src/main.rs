// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{str::Split, path::Path};
use std::result::Result;
use serde::Serialize;
use thiserror::Error;

use sonata_piper::from_config_path;
use sonata_synth::{
    AudioOutputConfig, SonataError, SonataSpeechSynthesizer
};

#[derive(Debug, Error, Serialize)]
enum SynthesisError {
    #[error("Configuration error: {0}")]
    ConfigError(String),
    #[error("Synthesis error: {0}")]
    SynthesisError(String),
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn synthesize_to_file(text: &str, output_path: &str, voice_config_path: &str) -> Result<bool, SynthesisError> {
    let text_list: Split<&str> = text.split(". ");

    let synth: SonataSpeechSynthesizer = {
        let voice = from_config_path(Path::new(voice_config_path))
            .map_err(|e: SonataError | SynthesisError::ConfigError(e.to_string()))?;
        SonataSpeechSynthesizer::new(voice)
            .map_err(|e: SonataError | SynthesisError::SynthesisError(e.to_string()))?
    };

    let mut i: i32 = 0;
    for sentence in text_list {
        let output_file_path: String = format!("{}/{}.wav", output_path, i);
        synth.synthesize_to_file(Path::new(&output_file_path), format!("{}{}", sentence, "."), Some(AudioOutputConfig {
            rate: Some(50),
            volume: Some(75),
            pitch: Some(50),
            appended_silence_ms: Some(0),
        }))
            .map_err(|e: SonataError| SynthesisError::SynthesisError(e.to_string()))?;
        i += 1;
    }

    Ok(true)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![synthesize_to_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}