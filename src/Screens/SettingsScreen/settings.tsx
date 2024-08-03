import "./settings.css";
import { IoClose } from "react-icons/io5";

type SettingsProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export default function Settings({ isOpen, setIsOpen }: SettingsProps) {
  return (
    <>
      <div
        onClick={() => {
          setIsOpen(false);
        }}
        style={{ display: isOpen ? "flex" : "none" }}
        className="settingsOverlay"
      ></div>
      <div
        style={{ display: isOpen ? "flex" : "none" }}
        className="settingsContainer"
      >
        <div className="settingsHeader">
          <h2 className="textTitle" style={{ flexGrow: 1 }}>
            Settings
          </h2>
          <button
            className="iconBtn"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <IoClose />
          </button>
        </div>
      </div>
    </>
  );
}
