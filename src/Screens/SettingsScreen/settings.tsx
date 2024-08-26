import "./settings.css";
import { IoClose } from "react-icons/io5";
import { invoke } from "@tauri-apps/api/tauri";
import AudioConfig from "../../Models/AudioConfig";
import SettingsSubScreen from "../../Components/SettingsSubScreen/settingssubscreen";

type SettingsProps = {
  defaultSettings: AudioConfig;
  setDefaultSettings: React.Dispatch<React.SetStateAction<AudioConfig>>;
  project: boolean;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  availableVoices: string[];
  setAvailableVoices: (value: string[]) => void;
};

export default function Settings({
  defaultSettings,
  setDefaultSettings,
  project,
  isOpen,
  setIsOpen,
  availableVoices,
  setAvailableVoices,
}: SettingsProps) {
  const closeSettings = () => {
    if (project) {
    } else {
      localStorage.setItem("voice", defaultSettings.voice);
      localStorage.setItem(
        "speech_rate",
        defaultSettings.speech_rate.toString()
      );
      localStorage.setItem(
        "speech_pitch",
        defaultSettings.speech_pitch.toString()
      );
      localStorage.setItem(
        "speech_volume",
        defaultSettings.speech_volume.toString()
      );
    }

    setIsOpen(false);
  };

  return (
    <>
      <div
        onClick={closeSettings}
        style={{ display: isOpen ? "flex" : "none" }}
        className="screenOverlay"
      ></div>
      <div
        style={{ display: isOpen ? "flex" : "none" }}
        className="screenContainer"
      >
        <div className="screenHeader">
          <h2 className="textTitle" style={{ flexGrow: 1, marginLeft: "3rem" }}>
            {project ? "Project Settings" : "General Settings"}
          </h2>
          <IoClose className="iconBtn" onClick={closeSettings} />
        </div>
        <SettingsSubScreen
          settings={defaultSettings}
          setSettings={setDefaultSettings}
          availableVoices={availableVoices}
          setAvailableVoices={setAvailableVoices}
        />
      </div>
    </>
  );
}
