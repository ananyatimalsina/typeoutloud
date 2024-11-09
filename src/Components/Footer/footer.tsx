import { useState } from "react";
import { IoPlay } from "react-icons/io5";
import { IoPause } from "react-icons/io5";
import { IoPlayBack } from "react-icons/io5";
import { IoPlayForward } from "react-icons/io5";
import { MdReplay } from "react-icons/md";

import "./footer.css";
import { invoke } from "@tauri-apps/api";
import CustomEventPayload from "../../Models/CustomEventPayload";

type FooterProps = {
  src: string[];
};

//TODO: Fix next and prev buttons

export default function Footer({ src }: FooterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [index, setIndex] = useState(0);

  const playAudio = () => {
    if (src.length > 0) {
      let event: CustomEventPayload;

      if (isRecovery) {
        event = {
          action: "recovery",
        };
      } else {
        event = {
          action: "play",
          file_path: src[index],
        };
      }

      invoke("handle_event", { event: JSON.stringify(event) }).catch((error) =>
        console.error(error)
      );
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (src.length > 0) {
      const event: CustomEventPayload = {
        action: "pause",
      };
      invoke("handle_event", { event: JSON.stringify(event) }).catch((error) =>
        console.error(error)
      );
      setIsPlaying(false);
      setIsRecovery(true);
    }
  };

  const nextAudio = () => {
    console.log(index);
    console.log(src.length);
    if (index !== src.length - 1) {
      setIsPlaying(false);
      setIsRecovery(false);
      setIndex((index + 1) % src.length);
      playAudio();
      setIsPlaying(true);
    }
  };

  const prevAudio = () => {
    if (index !== 0) {
      setIsPlaying(false);
      setIsRecovery(false);
      setIndex((index - 1) % src.length);
      playAudio();
      setIsPlaying(true);
    }
  };

  const replayAudio = () => {
    setIsPlaying(false);
    setIsRecovery(false);
    playAudio();
    setIsPlaying(true);
  };

  return (
    <div className="footerContainer">
      <IoPlayBack
        onClick={prevAudio}
        className={`iconBtn footerItem ${
          index === 0 || src.length === 0 ? "disabled" : ""
        }`}
      />
      {isPlaying ? (
        <IoPause
          onClick={pauseAudio}
          className={`iconBtn footerItem ${src.length === 0 ? "disabled" : ""}`}
        />
      ) : (
        <IoPlay
          onClick={playAudio}
          className={`iconBtn footerItem ${src.length === 0 ? "disabled" : ""}`}
        />
      )}
      <MdReplay
        onClick={replayAudio}
        className={`iconBtn footerItem ${src.length === 0 ? "disabled" : ""}`}
      />
      <IoPlayForward
        onClick={nextAudio}
        className={`iconBtn footerItem ${
          index === src.length - 1 || src.length === 0 ? "disabled" : ""
        }`}
      />
    </div>
  );
}
