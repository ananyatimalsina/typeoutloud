import React, { useEffect } from "react";
import "./typingscreen.css";
import Footer from "../../Components/Footer/footer";
import {
  ContextMenuTrigger,
  ContextMenu,
  ContextMenuItem,
  Submenu,
} from "rctx-contextmenu";

export default function TypingScreen() {
  const [height, setHeight] = React.useState(0);
  const width = window.innerWidth - 50;

  const fontSizes = ["1rem", "1.5rem", "2rem", "2.5rem", "3rem"];

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

  function generateFontSizeMenuItems() {
    return fontSizes.map((size) => (
      <ContextMenuItem
        key={size}
        disabled={fontSize === size}
        onClick={() => setFontSize(size)}
      >
        {size}
      </ContextMenuItem>
    ));
  }

  return (
    <div className="typingContainer">
      <ContextMenuTrigger id="dictation-solution-context-menu">
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
        ></textarea>
      </ContextMenuTrigger>

      <ContextMenu id="dictation-solution-context-menu">
        <Submenu title="Font Size">{generateFontSizeMenuItems()}</Submenu>
        <Submenu title="Font Style">
          <ContextMenuItem
            disabled={fontStyle === "bold"}
            onClick={() => {
              setFontStyle("bold");
            }}
          >
            Bold
          </ContextMenuItem>
          <ContextMenuItem
            disabled={fontStyle === "italic"}
            onClick={() => {
              setFontStyle("italic");
            }}
          >
            Italic
          </ContextMenuItem>
          <ContextMenuItem
            disabled={fontStyle === "normal"}
            onClick={() => {
              setFontStyle("normal");
            }}
          >
            Normal
          </ContextMenuItem>
        </Submenu>
      </ContextMenu>

      <Footer />
    </div>
  );
}
