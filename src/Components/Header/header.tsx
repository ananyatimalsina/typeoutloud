import { IoMdSettings } from "react-icons/io";
import Menu from "../Menu/menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";

import "./header.css";

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <div className="headerContainer">
      <div className="Menu">
        <Menu />
      </div>
      <h1 className="textTitle" style={{ flexGrow: 1, textAlign: "center" }}>
        {title}
      </h1>
      <button className="iconBtn ">
        <IoMdSettings className="settingsButton" />
      </button>
    </div>
  );
}
