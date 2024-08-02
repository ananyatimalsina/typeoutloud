import React from "react";

import { IoPlay } from "react-icons/io5";
import { IoPause } from "react-icons/io5";
import { IoPlayBack } from "react-icons/io5";
import { IoPlayForward } from "react-icons/io5";
import { MdReplay } from "react-icons/md";

import "./footer.css";

export default function Footer() {
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <div className="footerContainer">
      <button className="iconBtn footerItem">
        <IoPlayBack />
      </button>
      <button className="iconBtn footerItem">
        {isPlaying ? <IoPause /> : <IoPlay />}
      </button>
      <button className="iconBtn footerItem">
        <MdReplay />
      </button>
      <button className="iconBtn footerItem">
        <IoPlayForward />
      </button>
    </div>
  );
}