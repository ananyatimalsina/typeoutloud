import { ControlledMenu, MenuItem, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";

type ContextMenuProps = {
  fontSizes: string[];
  fontSize: string;
  setFontSize: (size: string) => void;
  fontStyles: string[];
  fontStyle: string;
  setFontStyle: (style: string) => void;
  anchorPoint: { x: number; y: number };
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

type OptionType = string | number;

export default function ContextMenu({
  fontSizes,
  fontSize,
  setFontSize,
  fontStyles,
  fontStyle,
  setFontStyle,
  anchorPoint,
  isOpen,
  setIsOpen,
}: ContextMenuProps) {
  function generateMenuItems<T extends OptionType>(
    currentValue: T,
    setValue: (value: T) => void,
    options: T[]
  ) {
    return options.map((option: T) => (
      <MenuItem
        key={option.toString()}
        disabled={currentValue === option}
        onClick={() => setValue(option)}
      >
        {option.toString()}
      </MenuItem>
    ));
  }

  return (
    <ControlledMenu
      anchorPoint={anchorPoint}
      state={isOpen ? "open" : "closed"}
      direction="right"
      onClose={() => setIsOpen(false)}
    >
      <SubMenu label="Font Size">
        {generateMenuItems(fontSize, setFontSize, fontSizes)}
      </SubMenu>
      <SubMenu label="Font Style">
        {generateMenuItems(fontStyle, setFontStyle, fontStyles)}
      </SubMenu>
    </ControlledMenu>
  );
}
