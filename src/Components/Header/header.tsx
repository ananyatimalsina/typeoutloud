import { IoMdSettings } from "react-icons/io";
import Menu from "../Menu/menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";

import "./header.css";

type HeaderProps = {
  title: string;
  setSettings: (value: boolean) => void;
};

export default function Header({ title, setSettings }: HeaderProps) {
  return (
    <div className="headerContainer">
      <div className="Menu">
        <Menu />
      </div>
      <h1 className="textTitle" style={{ flexGrow: 1 }}>
        {title}
      </h1>
      <IoMdSettings
        onClick={() => {
          setSettings(true);
        }}
        className="iconBtn settingsButton"
      />
    </div>
  );
}
