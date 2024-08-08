import React from "react";
import { IoClose } from "react-icons/io5";

interface NewFileScreenProps {
  setNewFile: (value: boolean) => void;
}

export default function NewFileScreen({ setNewFile }: NewFileScreenProps) {
  const closeNewFile = () => {
    setNewFile(false);
  };

  return (
    <>
      <div onClick={closeNewFile} className="screenOverlay"></div>
      <div className="screenContainer">
        <div className="screenHeader">
          <h2 className="textTitle" style={{ flexGrow: 1, marginLeft: "3rem" }}>
            New File
          </h2>
          <button className="iconBtn" onClick={closeNewFile}>
            <IoClose />
          </button>
        </div>
      </div>
    </>
  );
}
