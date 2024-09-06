import TypingScreen from "./Screens/TypingScreen/typingscreen";
import Header from "./Components/Header/header";
import { CSSProperties, useState } from "react";
import Settings from "./Screens/SettingsScreen/settings";
import NewFileScreen from "./Screens/NewFileScreen/newfilescreen";
import AudioConfig from "./Models/AudioConfig";

import BeatLoader from "react-spinners/BeatLoader";

function App() {
  const [title, setTitle] = useState("TypeOutLoud");

  const [settings, setSettings] = useState(false);
  const [newFile, setNewFile] = useState(false);
  const [loading, setLoading] = useState(false);

  const override: CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 999,
  };

  const [availableVoices, setAvailableVoices] = useState<string[]>([]);
  const [defaultSettings, setDefaultSettings] = useState<AudioConfig>({
    voice: localStorage.getItem("voice") || "null",
    speech_rate: Number(localStorage.getItem("speech_rate")) || 15,
    speech_pitch: Number(localStorage.getItem("speech_pitch")) || 50,
    speech_volume: Number(localStorage.getItem("speech_volume")) || 75,
  });

  return (
    <div className="container">
      <Header title={title} setSettings={setSettings} setNewFile={setNewFile} />
      <TypingScreen />
      <Settings
        defaultSettings={defaultSettings}
        setDefaultSettings={setDefaultSettings}
        project={false}
        isOpen={settings}
        setIsOpen={setSettings}
        availableVoices={availableVoices}
        setAvailableVoices={setAvailableVoices}
      />
      {newFile ? (
        <NewFileScreen
          defaultSettings={defaultSettings}
          setNewFile={setNewFile}
          setLoading={setLoading}
          availableVoices={availableVoices}
          setAvailableVoices={setAvailableVoices}
        />
      ) : null}
      {loading ? <div className="screenOverlay" /> : null}
      <BeatLoader
        color="#ffffff"
        cssOverride={override}
        loading={loading}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default App;
