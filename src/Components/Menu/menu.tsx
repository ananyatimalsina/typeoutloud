import { useRef } from "react";
import {
  ControlledMenu,
  MenuItem,
  useHover,
  useMenuState,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";

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

export default function Menu() {
  return (
    <div className="Menu">
      <HoverMenuWithTransition
        title="File"
        menuItems={[
          <MenuItem>New</MenuItem>,
          <MenuItem>Open</MenuItem>,
          <MenuItem>Save</MenuItem>,
          <MenuItem>Exit</MenuItem>,
        ]}
      />
    </div>
  );
}
