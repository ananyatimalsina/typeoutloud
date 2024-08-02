import React, { useEffect } from "react";
import "./typingscreen.css";
import Footer from "../../Components/Footer/footer";

//TODO: Implement custom context menu for textarea to change font size, font style, etc.

export default function TypingScreen() {
  const [height, setHeight] = React.useState(0);

  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.innerHeight;
      setHeight(viewportHeight - 175);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="typingContainer">
      <textarea
        className="dictationSolution"
        name="dictationSolution"
        id="dictationSolution"
        style={{ height: height }}
        onCopy={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      ></textarea>
      <Footer />
    </div>
  );
}
