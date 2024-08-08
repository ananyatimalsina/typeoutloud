import "./settings.css";
import { IoClose, IoFolderOpen } from "react-icons/io5";
import { useEffect, useState } from "react";
import VoiceSelectMenu from "../../Components/VoiceSelectMenu/voiceselectmenu";
import SettingsSlider from "../../Components/SettingsSlider/settingsslider";

import { readDir, createDir, exists, BaseDirectory } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/api/shell";

type SettingsProps = {
  project: boolean;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export default function Settings({
  project,
  isOpen,
  setIsOpen,
}: SettingsProps) {
  const [voice, setVoice] = useState(localStorage.getItem("voice") || "enUS");
  const [speechRate, setSpeechRate] = useState(
    Number(localStorage.getItem("speechRate")) || 50
  );
  const [speechPitch, setSpeechPitch] = useState(
    Number(localStorage.getItem("speechPitch")) || 50
  );
  const [speechVolume, setSpeechVolume] = useState(
    Number(localStorage.getItem("speechVolume")) || 75
  );

  var availableVoices: string[][] = [];

  const getAvailableVoices = async () => {
    const dirExists = await exists("voices", { dir: BaseDirectory.AppData });

    if (!dirExists) {
      await createDir("voices", {
        dir: BaseDirectory.AppData,
        recursive: true,
      });
    }

    const entries = await readDir("voices", {
      dir: BaseDirectory.AppData,
      recursive: true,
    }).catch(() => {
      return [];
    });

    for (const entry of entries) {
      if (
        !entry.name?.endsWith(".onnx.json") &&
        !entry.children &&
        entry.name?.endsWith(".onnx")
      ) {
        const voiceName = entry.name.replace(".onnx", "");
        if (voiceName) {
          availableVoices.push([voiceName, entry.path]);
        }
      }
    }
  };

  useEffect(() => {
    getAvailableVoices();
  }, []);

  const closeSettings = () => {
    if (project) {
    } else {
      localStorage.setItem("voice", voice);
      localStorage.setItem("speechRate", speechRate.toString());
      localStorage.setItem("speechPitch", speechPitch.toString());
      localStorage.setItem("speechVolume", speechVolume.toString());
    }

    setIsOpen(false);
  };

  return (
    <>
      <div
        onClick={closeSettings}
        style={{ display: isOpen ? "flex" : "none" }}
        className="settingsOverlay"
      ></div>
      <div
        style={{ display: isOpen ? "flex" : "none" }}
        className="settingsContainer"
      >
        <div className="settingsHeader">
          <h2 className="textTitle" style={{ flexGrow: 1, marginLeft: "3rem" }}>
            {project ? "Project Settings" : "General Settings"}
          </h2>
          <button className="iconBtn" onClick={closeSettings}>
            <IoClose />
          </button>
        </div>
        <h3 className="textTitle" style={{ textAlign: "start" }}>
          Text To Speech
        </h3>
        <div className="subSettingsContainer">
          <div className="singularSettingContainer" style={{ width: "auto" }}>
            <span className="singularSettingName">Voice:</span>
            <VoiceSelectMenu
              voice={voice}
              setVoice={setVoice}
              avilableVoices={availableVoices}
            />
            <IoFolderOpen
              onClick={async () => {
                const appDataDirPath = await appDataDir();
                await open(appDataDirPath + "voices/");
              }}
              style={{ marginLeft: "0.5rem", cursor: "pointer" }}
            />
          </div>

          <div className="singularSettingContainer">
            <span className="singularSettingName">Speech Rate:</span>
            <SettingsSlider setting={speechRate} setSetting={setSpeechRate} />
          </div>

          <div className="singularSettingContainer">
            <span className="singularSettingName">Speech Pitch:</span>
            <SettingsSlider setting={speechPitch} setSetting={setSpeechPitch} />
          </div>

          <div className="singularSettingContainer">
            <span className="singularSettingName">Speech Volume:</span>
            <SettingsSlider
              setting={speechVolume}
              setSetting={setSpeechVolume}
            />
          </div>
        </div>
      </div>
    </>
  );
}
