import { useRef } from "react";
import {
  ControlledMenu,
  MenuItem,
  useHover,
  useMenuState,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";

import { exit } from "@tauri-apps/api/process";

import "./menu.css";

type HoverMenuWithTransitionProps = {
  title: string;
  menuItems: JSX.Element[];
};

const HoverMenuWithTransition = ({
  title,
  menuItems,
}: HoverMenuWithTransitionProps) => {
  const ref = useRef(null);
  const [menuState, toggle] = useMenuState({ transition: true });
  const { anchorProps, hoverProps } = useHover(menuState.state, toggle);

  return (
    <>
      <div className="menuHoverBtn" ref={ref} {...anchorProps}>
        {title}
      </div>

      <ControlledMenu
        {...hoverProps}
        {...menuState}
        anchorRef={ref}
        onClose={() => toggle(false)}
      >
        {menuItems}
      </ControlledMenu>
    </>
  );
};

type MenuProps = {
  setNewFile: (value: boolean) => void;
};

export default function Menu({ setNewFile }: MenuProps) {
  return (
    <div className="Menu">
      <HoverMenuWithTransition
        title="File"
        menuItems={[
          <MenuItem
            onClick={() => {
              setNewFile(true);
            }}
          >
            New
          </MenuItem>,
          <MenuItem>Open</MenuItem>,
          <MenuItem
            onClick={async () => {
              await exit(0);
            }}
          >
            Exit
          </MenuItem>,
        ]}
      />
    </div>
  );
}
