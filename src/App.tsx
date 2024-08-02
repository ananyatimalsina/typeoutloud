import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import TypingScreen from "./Screens/TypingScreen";
import Header from "./Components/Header/header";
import Footer from "./Components/Footer/footer";

function App() {
  return (
    <div className="container">
      <Header title="Der Bäcker" />
      <TypingScreen />
    </div>
  );
}

export default App;
