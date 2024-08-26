import SettingsSlider from "../SettingsSlider/settingsslider";
import { IoFolderOpen, IoRefresh, IoPlay } from "react-icons/io5";
import VoiceSelectMenu from "../VoiceSelectMenu/voiceselectmenu";
import AudioConfig from "../../Models/AudioConfig";
import { open } from "@tauri-apps/api/shell";
import { appDataDir } from "@tauri-apps/api/path";
import { BaseDirectory, createDir, exists, readDir } from "@tauri-apps/api/fs";
import { useEffect, useState } from "react";

import "./settingssubscreen.css";
import { invoke } from "@tauri-apps/api/tauri";

interface SettingsSubScreenProps {
  settings: AudioConfig;
  setSettings: React.Dispatch<React.SetStateAction<AudioConfig>>;
  availableVoices: string[];
  setAvailableVoices: (value: string[]) => void;
}

export default function SettingsSubScreen({
  settings,
  setSettings,
  availableVoices,
  setAvailableVoices,
}: SettingsSubScreenProps) {
  const [speech, setSpeech] = useState<string>(
    localStorage.getItem("speech") ||
      "This is how the voice sounds with the current settings."
  );

  const getAvailableVoices = async () => {
    if (
      !(await exists("voices", {
        dir: BaseDirectory.AppData,
      }))
    ) {
      await createDir("voices", {
        dir: BaseDirectory.AppData,
        recursive: true,
      });
    }

    const entries = await readDir("voices", {
      dir: BaseDirectory.AppData,
      recursive: true,
    }).catch((err) => {
      console.error(err);
      return [];
    });

    var voices: string[] = [];
    var voice_exists = false;
    for (const entry of entries) {
      if (
        entry.name?.endsWith(".onnx.json") &&
        !entry.children &&
        !entry.name?.endsWith(".onnx")
      ) {
        const voiceName = entry.name.replace(".onnx.json", "");
        if (voiceName) {
          if (voiceName === settings.voice) {
            voice_exists = true;
          }
          voices.push(voiceName);
        }
      }
    }
    if (!voice_exists) {
      setSettings((prev) => ({ ...prev, voice: "null" }));
    }
    return voices;
  };

  const handleVoiceChange = (e: string) => {
    setSettings((prev) => ({ ...prev, voice: e }));
  };

  const handleSpeechRateChange = (e: number) => {
    setSettings((prev) => ({ ...prev, speech_rate: e }));
  };

  const handlespeech_pitchChange = (e: number) => {
    setSettings((prev) => ({ ...prev, speech_pitch: e }));
  };

  const handlespeech_volumeChange = (e: number) => {
    setSettings((prev) => ({ ...prev, speech_volume: e }));
  };

  useEffect(() => {
    getAvailableVoices().then((voices) => {
      setAvailableVoices(voices);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("speech", speech);
  }, [speech]);

  return (
    <>
      <h3 className="titleText">Text To Speech</h3>

      <div className="subSettingsContainer">
        <div className="singularSettingContainer" style={{ width: "auto" }}>
          <span className="singularSettingName">Voice:</span>
          <VoiceSelectMenu
            voice={settings.voice}
            handleVoiceChange={handleVoiceChange}
            avilableVoices={availableVoices}
          />
          <IoFolderOpen
            onClick={async () => {
              const appDataDirPath = await appDataDir();
              open(appDataDirPath + "voices/");
              console.log(appDataDirPath + "voices/");
            }}
            style={{
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
              cursor: "pointer",
            }}
          />
          <IoRefresh
            onClick={async () => {
              setAvailableVoices(await getAvailableVoices());
            }}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="singularSettingContainer">
          <span className="singularSettingName">Speech Rate:</span>
          <SettingsSlider
            setting={settings.speech_rate}
            setSetting={handleSpeechRateChange}
          />
        </div>

        <div className="singularSettingContainer">
          <span className="singularSettingName">Speech Pitch:</span>
          <SettingsSlider
            setting={settings.speech_pitch}
            setSetting={handlespeech_pitchChange}
          />
        </div>

        <div className="singularSettingContainer">
          <span className="singularSettingName">Speech Volume:</span>
          <SettingsSlider
            setting={settings.speech_volume}
            setSetting={handlespeech_volumeChange}
          />
        </div>

        <div className="singularSettingContainer">
          <span className="singularSettingName">Speech:</span>
          <input
            type="text"
            value={speech}
            onChange={(e) => setSpeech(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                invoke("synthesize_and_play", {
                  text: speech,
                  config: settings,
                })
                  .then((message) => console.log(message))
                  .catch((err) => console.error(err));
              }
            }}
          />
          <IoPlay
            style={{
              marginLeft: "0.5rem",
              cursor: "pointer",
              flexShrink: 0,
            }}
            onClick={() => {
              invoke("synthesize_and_play", {
                text: speech,
                config: settings,
              })
                .then((message) => console.log(message))
                .catch((err) => console.error(err));
            }}
          />
        </div>
      </div>
    </>
  );
}
