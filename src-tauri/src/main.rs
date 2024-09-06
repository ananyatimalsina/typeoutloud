// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::File;
use std::fs::create_dir_all;
use std::io::Read;
use std::path::PathBuf;
use std::{str::Split, path::Path};
use std::result::Result;
use audio_ops::{AudioInfo, WaveWriterError};
use serde::{Deserialize, Serialize};
use thiserror::Error;

use sonata_piper::from_config_path;
use sonata_synth::{
    AudioOutputConfig, AudioSamples, SonataError, SonataSpeechSynthesizer
};

use rodio::{Decoder, OutputStream, Sink, source::Source};
use std::io::BufReader;
use std::io::Cursor;
use std::error::Error;

#[derive(Debug, Error, Serialize)]
enum SynthesisError {
    #[error("Configuration error: {0}")]
    ConfigError(String),
    #[error("Synthesis error: {0}")]
    SynthesisError(String),
}

impl From<WaveWriterError> for SynthesisError {
    fn from(err: WaveWriterError) -> SynthesisError {
        SynthesisError::ConfigError(err.to_string())
    }
}

#[derive(Serialize, Deserialize)]
struct AudioConfig {
    voice: String,
    speech_rate: u8,
    speech_pitch: u8,
    speech_volume: u8,
}

// TODO: Fix the generated audio being sterio and only audible on the left ear
#[tauri::command(async)]
fn synthesize_to_file(app_handle: tauri::AppHandle, text: &str, output_path: &str, config: AudioConfig) -> Result<bool, SynthesisError> {
    create_dir_all(output_path).map_err(|e| SynthesisError::SynthesisError(e.to_string()))?;

    let mut file = File::open(Path::new(text)).map_err(|e| SynthesisError::SynthesisError(e.to_string()))?;
    let mut content = String::new();
    file.read_to_string(&mut content).map_err(|e| SynthesisError::SynthesisError(e.to_string()))?;

    let cleaned_content = content.replace("\n", " ").replace("\r", "");

    let text_list: Split<&str> = cleaned_content.split(". ");

    let synth: SonataSpeechSynthesizer = {
        let app_data_dir: PathBuf = app_handle.path_resolver().app_data_dir().unwrap();
        let app_data_dir_str: &str = app_data_dir.to_str().ok_or_else(|| SynthesisError::ConfigError("Invalid app data directory".to_string()))?;
        let voice_path: String = format!("{}/voices/{}.onnx.json", app_data_dir_str, config.voice);
        let voice = from_config_path(Path::new(&voice_path))
            .map_err(|e: SonataError| SynthesisError::ConfigError(e.to_string()))?;
        SonataSpeechSynthesizer::new(voice)
            .map_err(|e: SonataError| SynthesisError::SynthesisError(e.to_string()))?
    };

    let mut i: i32 = 0;
    for sentence in text_list {
        let output_file_path: String = format!("{}/{}.wav", output_path, i);
        synth.synthesize_to_file(Path::new(&output_file_path), format!("{}.", sentence), Some(AudioOutputConfig {
            rate: Some(config.speech_rate),
            volume: Some(config.speech_volume),
            pitch: Some(config.speech_pitch),
            appended_silence_ms: Some(0),
        }))
            .map_err(|e: SonataError| SynthesisError::SynthesisError(e.to_string()))?;
        i += 1;
    }

    Ok(true)
}

#[tauri::command(async)]
fn synthesize_and_play(app_handle: tauri::AppHandle, text: String, config: AudioConfig) -> Result<bool, SynthesisError> {
    let app_data_dir: PathBuf = app_handle.path_resolver().app_data_dir().unwrap();
    let app_data_dir_str: &str = app_data_dir.to_str().ok_or_else(|| SynthesisError::ConfigError("Invalid app data directory".to_string()))?;
    let voice_path: String = format!("{}/voices/{}.onnx.json", app_data_dir_str, config.voice);
    let voice = from_config_path(Path::new(&voice_path))
    .map_err(|e: SonataError| SynthesisError::ConfigError(e.to_string()))?;

    let synth: SonataSpeechSynthesizer = SonataSpeechSynthesizer::new(voice.clone())
    .map_err(|e: SonataError| SynthesisError::SynthesisError(e.to_string()))?;
    
    let mut samples: Vec<f32> = Vec::new();
    for result in synth.synthesize_parallel(text, Some(AudioOutputConfig {
        rate: Some(config.speech_rate),
        volume: Some(config.speech_volume),
        pitch: Some(config.speech_pitch),
        appended_silence_ms: Some(0),
    })).map_err(|e: SonataError| SynthesisError::ConfigError(e.to_string()))? {
        match result {
            Ok(ws) => {
                samples.append(&mut ws.into_vec());
            }
            Err(e) => return Err(SynthesisError::SynthesisError(e.to_string())),
        };
    }
    if samples.is_empty() {
        return Err(SynthesisError::SynthesisError(
            "No speech data to write".to_string(),
        ));
    }

    let audio: AudioSamples = AudioSamples::from(samples);

    let mut wave_buffer: Vec<u8> = Vec::new();
    let wavinfo: AudioInfo = voice.audio_output_info().map_err(|e: SonataError| SynthesisError::ConfigError(e.to_string()))?;

    audio_ops::write_wave_samples_to_buffer(
        Cursor::new(&mut wave_buffer), 
        audio.to_i16_vec().iter(), 
        wavinfo.sample_rate as u32,
        wavinfo.num_channels.try_into().unwrap(),
        wavinfo.sample_width.try_into().unwrap(),
    )?;

    // Play the WAV buffer using rodio
    let (_stream, stream_handle) = OutputStream::try_default().map_err(|e| SynthesisError::ConfigError(e.to_string()))?;
    let sink: Sink = Sink::try_new(&stream_handle).map_err(|e| SynthesisError::ConfigError(e.to_string()))?;
    let cursor: Cursor<Vec<u8>> = Cursor::new(wave_buffer);
    let source: Decoder<Cursor<Vec<u8>>> = Decoder::new(cursor).map_err(|e| SynthesisError::ConfigError(e.to_string()))?;
    sink.append(source);
    sink.sleep_until_end();

    Ok(true)
}

fn play_audio(file: File) -> Result<(), Box<dyn Error>> {
    // Create an output stream to play audio
    let (_stream, stream_handle) = OutputStream::try_default()?;
    
    // Load the WAV file
    let decoder = Decoder::new(BufReader::new(file))?;
    
    // Get the total duration before moving the decoder
    let duration = decoder.total_duration().unwrap().as_secs_f32();

    // Play the audio
    stream_handle.play_raw(decoder.convert_samples())?;

    // Block the main thread until the sound has finished playing
    std::thread::sleep(std::time::Duration::from_secs_f32(duration));

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![synthesize_to_file, synthesize_and_play])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}