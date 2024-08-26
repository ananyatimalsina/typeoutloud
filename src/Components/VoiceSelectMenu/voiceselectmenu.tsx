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
  handleVoiceChange: (value: string) => void;
  avilableVoices: string[];
};

export default function VoiceSelectMenu({
  voice,
  handleVoiceChange,
  avilableVoices,
}: VoiceSelectMenuProps) {
  const [filter, setFilter] = useState("");

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
      <MenuRadioGroup
        value={voice}
        onRadioChange={(e) => handleVoiceChange(e.value)}
      >
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
