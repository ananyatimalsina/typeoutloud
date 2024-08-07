import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { handleRender } from "./TooltipSlider";

type SettingsSliderProps = {
  setting: number;
  setSetting: (value: number) => void;
};

export default function SettingsSlider({
  setting,
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
            setSetting(e[0]);
          } else {
            setSetting(e);
          }
        }}
      />
    </>
  );
}
