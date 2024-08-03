import React, { useEffect } from "react";
import "./typingscreen.css";
import Footer from "../../Components/Footer/footer";
import ContextMenu from "../../Components/ContextMenu/contextmenu";

export default function TypingScreen() {
  const [height, setHeight] = React.useState(0);
  const width = window.innerWidth - 50;

  const [isOpen, setIsOpen] = React.useState(false);
  const [anchorPoint, setAnchorPoint] = React.useState({ x: 0, y: 0 });

  const fontSizes = ["1rem", "1.5rem", "2rem", "2.5rem", "3rem"];
  const fontStyles = ["normal", "italic", "bold"];

  const [fontSize, setFontSize] = React.useState("1rem");
  const [fontStyle, setFontStyle] = React.useState("normal");

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
        style={{
          height: height,
          width: width,
          fontSize: fontSize,
          fontStyle: fontStyle,
        }}
        onCopy={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
        onContextMenu={(e) => {
          if (typeof document.hasFocus === "function" && !document.hasFocus())
            return;

          e.preventDefault();
          setAnchorPoint({ x: e.clientX, y: e.clientY });
          setIsOpen(true);
        }}
      ></textarea>
      <ContextMenu
        fontSizes={fontSizes}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontStyles={fontStyles}
        fontStyle={fontStyle}
        setFontStyle={setFontStyle}
        anchorPoint={anchorPoint}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <Footer />
    </div>
  );
}
