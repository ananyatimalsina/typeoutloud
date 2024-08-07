import { Menu, MenuButton, MenuItem, MenuRadioGroup } from "@szhsin/react-menu";
import "./settings.css";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import VoiceSelectMenu from "../../Components/VoiceSelectMenu/voiceselectmenu";
import SettingsSlider from "../../Components/SettingsSlider/settingsslider";

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
  const [voice, setVoice] = useState("en-US");
  const [speechRate, setSpeechRate] = useState(50);
  const [speechPitch, setSpeechPitch] = useState(50);
  const [speechVolume, setSpeechVolume] = useState(75);

  return (
    <>
      <div
        onClick={() => {
          setIsOpen(false);
        }}
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
          <button
            className="iconBtn"
            onClick={() => {
              setIsOpen(false);
            }}
          >
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
              avilableVoices={["enUS", "nep", "in", "deDE"]}
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
