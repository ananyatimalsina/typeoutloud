import { IoClose, IoFolder } from "react-icons/io5";
import SettingsSubScreen from "../../Components/SettingsSubScreen/settingssubscreen";
import { useEffect, useRef, useState } from "react";
import AudioConfig from "../../Models/AudioConfig";

import { open } from "@tauri-apps/api/dialog";
import { homeDir } from "@tauri-apps/api/path";

import "./newfilescreen.css";
import { exists } from "@tauri-apps/api/fs";
import { invoke } from "@tauri-apps/api";

interface NewFileScreenProps {
  defaultSettings: AudioConfig;
  setNewFile: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  availableVoices: string[];
  setAvailableVoices: (value: string[]) => void;
}

export default function NewFileScreen({
  defaultSettings,
  setNewFile,
  setLoading,
  availableVoices,
  setAvailableVoices,
}: NewFileScreenProps) {
  const [settings, setSettings] = useState<AudioConfig>(defaultSettings);
  const [title, setTitle] = useState<string>("");
  const [textUrl, setTextUrl] = useState<string>("");
  const [location, setLocation] = useState<string>(
    localStorage.getItem("location") || ""
  );

  const inputTitleRef = useRef<HTMLInputElement>(null);
  const inputTextUrlRef = useRef<HTMLInputElement>(null);
  const inputLocationRef = useRef<HTMLInputElement>(null);

  const closeNewFile = () => {
    setNewFile(false);
  };

  const addError = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current!.classList.add("error");
    ref.current!.parentElement!.classList.add("error");
    setTimeout(() => {
      ref.current!.parentElement!.classList.remove("error");
    }, 500);
  };

  const resetError = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current!.classList.remove("error");
  };

  useEffect(() => {
    localStorage.setItem("location", location);
  }, [location]);

  return (
    <>
      <div onClick={closeNewFile} className="screenOverlay"></div>
      <div className="screenContainer">
        <div className="screenHeader">
          <h2 className="textTitle" style={{ flexGrow: 1, marginLeft: "3rem" }}>
            New File
          </h2>
          <IoClose className="iconBtn" onClick={closeNewFile} />
        </div>

        <h3 className="titleText">Project</h3>
        <div className="subSettingsContainer">
          <div className="singularSettingContainer">
            <span className="singularSettingName">Title:</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              ref={inputTitleRef}
              onFocus={() => resetError(inputTitleRef)}
              type="text"
            />
          </div>

          <div className="singularSettingContainer">
            <span className="singularSettingName">Text URL:</span>
            <input
              value={textUrl}
              onChange={(e) => setTextUrl(e.target.value)}
              ref={inputTextUrlRef}
              onFocus={() => resetError(inputTextUrlRef)}
              type="text"
            />
            <IoFolder
              onClick={async () => {
                resetError(inputTextUrlRef);
                const selected = await open({
                  directory: false,
                  multiple: false,
                  title: "Select an input file",
                  defaultPath: await homeDir(),
                });

                if (selected && !Array.isArray(selected)) {
                  console.log(selected);
                  setTextUrl(selected);
                }
              }}
              style={{
                marginLeft: "0.5rem",
                marginRight: "0.5rem",
                cursor: "pointer",
                flexShrink: 0,
              }}
            />
          </div>

          <div className="singularSettingContainer">
            <span className="singularSettingName">Location:</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              ref={inputLocationRef}
              onFocus={() => resetError(inputLocationRef)}
              type="text"
            />
            <IoFolder
              onClick={async () => {
                resetError(inputLocationRef);
                const selected = await open({
                  directory: true,
                  multiple: false,
                  title: "Select a location",
                  defaultPath: await homeDir(),
                });

                if (selected && !Array.isArray(selected)) {
                  setLocation(selected);
                }
              }}
              style={{
                marginLeft: "0.5rem",
                marginRight: "0.5rem",
                cursor: "pointer",
                flexShrink: 0,
              }}
            />
          </div>
        </div>

        <SettingsSubScreen
          settings={settings}
          setSettings={setSettings}
          availableVoices={availableVoices}
          setAvailableVoices={setAvailableVoices}
        />

        <button
          className="createBtn"
          onClick={async () => {
            var isError = false;
            if (!title) {
              addError(inputTitleRef);
              isError = true;
            }
            if (!textUrl || !(await exists(textUrl).catch(() => false))) {
              addError(inputTextUrlRef);
              isError = true;
            }
            if (!location || !(await exists(location).catch(() => false))) {
              addError(inputLocationRef);
              isError = true;
            }

            if (!isError) {
              closeNewFile();
              setLoading(true);
              invoke("synthesize_to_file", {
                text: textUrl,
                outputPath: location + "/" + title + "/",
                config: settings,
              })
                .catch((e) => {
                  console.error(e);
                })
                .then(() => {
                  setLoading(false);
                });
            }
          }}
        >
          Create
        </button>
      </div>
    </>
  );
}
