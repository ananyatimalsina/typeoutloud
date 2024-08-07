import { useEffect, useState } from "react";
import {
  Menu,
  MenuItem,
  FocusableItem,
  MenuButton,
  MenuRadioGroup,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";

type VoiceSelectMenuProps = {
  voice: string;
  setVoice: (value: string) => void;
  avilableVoices: string[];
};

export default function VoiceSelectMenu({
  voice,
  setVoice,
  avilableVoices,
}: VoiceSelectMenuProps) {
  const [filter, setFilter] = useState("");

  useEffect(() => {
    console.log("Voice changed to: ", voice);
  }, [voice]);

  return (
    <Menu
      menuButton={<MenuButton>{voice}</MenuButton>}
      onMenuChange={(e) => e.open && setFilter("")}
    >
      <FocusableItem>
        {({ ref }) => (
          <input
            ref={ref}
            type="text"
            placeholder="Type to filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        )}
      </FocusableItem>
      <MenuRadioGroup value={voice} onRadioChange={(e) => setVoice(e.value)}>
        {avilableVoices
          .filter((voice) =>
            voice.toUpperCase().includes(filter.trim().toUpperCase())
          )
          .map((voice) => (
            <MenuItem type="radio" value={voice} key={voice}>
              {voice}
            </MenuItem>
          ))}
      </MenuRadioGroup>
    </Menu>
  );
}
