import TypingScreen from "./Screens/TypingScreen/typingscreen";
import Header from "./Components/Header/header";

function App() {
  return (
    <div className="container">
      <Header title="Der Bäcker" />
      <TypingScreen />
    </div>
  );
}

export default App;
