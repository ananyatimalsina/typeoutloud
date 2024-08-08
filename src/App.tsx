import TypingScreen from "./Screens/TypingScreen/typingscreen";
import Header from "./Components/Header/header";
import { useState } from "react";
import Settings from "./Screens/SettingsScreen/settings";
import NewFileScreen from "./Screens/NewFileScreen/newfilescreen";

function App() {
  const [title, setTitle] = useState("TypeOutLoud");
  const [settings, setSettings] = useState(false);
  const [newFile, setNewFile] = useState(false);

  return (
    <div className="container">
      <Header title={title} setSettings={setSettings} setNewFile={setNewFile} />
      <TypingScreen />
      <Settings project={false} isOpen={settings} setIsOpen={setSettings} />
      {newFile ? <NewFileScreen setNewFile={setNewFile} /> : null}
    </div>
  );
}

export default App;
