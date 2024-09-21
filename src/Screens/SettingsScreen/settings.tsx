import "./settings.css";
import { IoClose } from "react-icons/io5";
import AudioConfig from "../../Models/AudioConfig";
import SettingsSubScreen from "../../Components/SettingsSubScreen/settingssubscreen";
import Project from "../../Models/Project";
import { invoke } from "@tauri-apps/api";

type SettingsProps = {
  defaultSettings: AudioConfig;
  setDefaultSettings: React.Dispatch<React.SetStateAction<AudioConfig>>;
  project: Project | null;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  availableVoices: string[];
  setAvailableVoices: (value: string[]) => void;
  setLoading: (value: boolean) => void;
};

export default function Settings({
  project,
  setProject,
  defaultSettings,
  setDefaultSettings,
  isOpen,
  setIsOpen,
  availableVoices,
  setAvailableVoices,
  setLoading,
}: SettingsProps) {
  const closeSettings = () => {
    if (project) {
      setIsOpen(false);
      setLoading(true);
      invoke("synthesize_to_file", {
        project: project,
        redo: true,
      })
        .catch((e) => {
          console.error(e);
        })
        .then((res) => {
          setProject(res as Project);
          setLoading(false);
        });
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
      setIsOpen(false);
    }
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
          project={project}
          setProject={setProject}
          availableVoices={availableVoices}
          setAvailableVoices={setAvailableVoices}
        />
      </div>
    </>
  );
}
