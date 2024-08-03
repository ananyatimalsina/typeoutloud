import TypingScreen from "./Screens/TypingScreen/typingscreen";
import Header from "./Components/Header/header";
import { useState } from "react";
import Settings from "./Screens/SettingsScreen/settings";

function App() {
  const [settings, setSettings] = useState(false);

  return (
    <div className="container">
      <Header title="Der Bäcker" setSettings={setSettings} />
      <TypingScreen />
      <Settings isOpen={settings} setIsOpen={setSettings} />
    </div>
  );
}

export default App;
