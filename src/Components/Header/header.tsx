import { IoMdSettings } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";

import "./header.css";

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <div className="headerContainer">
      <button className="iconBtn ">
        <GiHamburgerMenu />
      </button>
      <h1 className="textTitle" style={{ flexGrow: 1, textAlign: "center" }}>
        {title}
      </h1>
      <button className="iconBtn ">
        <IoMdSettings className="settingsButton" />
      </button>
    </div>
  );
}
