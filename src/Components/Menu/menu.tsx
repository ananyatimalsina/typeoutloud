import { useRef } from "react";
import {
  ControlledMenu,
  MenuItem,
  useHover,
  useMenuState,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";

import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import { homeDir } from "@tauri-apps/api/path";
import { exit } from "@tauri-apps/api/process";

import "./menu.css";
import Project from "../../Models/Project";

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
  setProject: React.Dispatch<React.SetStateAction<Project>>;
};

export default function Menu({ setNewFile, setProject }: MenuProps) {
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
          <MenuItem
            onClick={async () => {
              const selected = await open({
                directory: false,
                multiple: false,
                filters: [
                  { name: "TypeOutLoud Project files", extensions: ["tol"] },
                ],
                title: "Select a Project",
                defaultPath: await homeDir(),
              });

              if (selected && !Array.isArray(selected)) {
                invoke("open_project", {
                  projectPath: selected,
                })
                  .catch((e) => {
                    console.error(e);
                  })
                  .then((res) => {
                    setProject(res as Project);
                  });
              }
            }}
          >
            Open
          </MenuItem>,
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
