import TypingScreen from "./Screens/TypingScreen/typingscreen";
import Header from "./Components/Header/header";
import { useState } from "react";
import Settings from "./Screens/SettingsScreen/settings";

function App() {
  const [settings, setSettings] = useState(false);
  const [title, setTitle] = useState("TypeOutLoud");

  return (
    <div className="container">
      <Header title={title} setSettings={setSettings} />
      <TypingScreen />
      <Settings project={false} isOpen={settings} setIsOpen={setSettings} />
    </div>
  );
}

export default App;
