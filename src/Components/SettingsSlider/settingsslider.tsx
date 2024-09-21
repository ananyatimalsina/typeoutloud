import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { handleRender } from "./TooltipSlider";
import AudioConfig from "../../Models/AudioConfig";

type SettingsSliderProps = {
  setting: number;
  variable: keyof AudioConfig;
  setSetting: <K extends keyof AudioConfig>(variable: K, e: number) => void;
};

export default function SettingsSlider({
  setting,
  variable,
  setSetting,
}: SettingsSliderProps) {
  return (
    <>
      <Slider
        min={0}
        max={100}
        handleRender={handleRender}
        value={setting}
        onChange={(e) => {
          if (Array.isArray(e)) {
            setSetting(variable, e[0]);
          } else {
            setSetting(variable, e);
          }
        }}
      />
    </>
  );
}
