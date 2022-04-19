import makeStyles from "@material-ui/core/styles/makeStyles";
import hexToRgbA from "../utils/hexToRgbA";
import { PopoverOrigin } from "@material-ui/core/Popover";
import { IActions } from "../ActionsMenu";
import { size, borderradius, colorDefault, colorVariant } from "./constants";

interface IStyles {
  variant: "light" | "bold";
  color: string;
  hover: boolean;
  selected: boolean;
  disabled: boolean;
  emoji: string;
  icon: string;
  label: string;
  onClick: (event: React.MouseEvent) => void;
  menu: {
    anchorOrigin?: PopoverOrigin;
    transformOrigin?: PopoverOrigin;
    onClose?: () => void;
    items: IActions[];
  };
  menuOpen: boolean;
}
const useStyles = makeStyles(({ palette }) => {
  const colorMain = palette.primary.main;
  const getColor = ({
    variant,
    onClick,
    menu,
    menuOpen,
    color,
    disabled,
    hover,
    selected,
  }: IStyles) => {
    if (disabled) return hexToRgbA(colorDefault, 0.4);
    if (variant === "light") {
      const hoverCheck = hover && (!!onClick || !!menu);
      if (hoverCheck || selected || menuOpen) {
        return color || colorMain;
      }
      return colorDefault;
    } else {
      return color ? "#fff" : colorDefault;
    }
  };
  const getBackground = ({
    variant,
    onClick,
    disabled,
    color,
    menu,
    menuOpen,
    selected,
    hover,
  }: IStyles) => {
    if (variant === "light") {
      const hoverCheck = hover && (!!onClick || !!menu);
      if (!disabled && (hoverCheck || selected || menuOpen)) {
        return hexToRgbA(color || colorMain, 0.15);
      }
      return "transparent";
    } else {
      if (disabled) return colorVariant;
      return color || colorVariant;
    }
  };

  return {
    button: {
      position: "relative",
      "max-width": 200,
      "min-width": size,
      "max-height": size,
      "min-height": size,
      cursor: ({ disabled, onClick, menu }: IStyles) =>
        !disabled && (!!onClick || !!menu) ? "pointer" : "default",
      padding: ({ icon, label, emoji }: IStyles) =>
        emoji || icon || label ? "0 5px" : 0,
      margin: "0 2px",
      display: "inline-flex",
      transition: "all 350ms",
      "border-radius": borderradius,
      "vertical-align": "middle",
      color: getColor, // ripple
      "background-color": getBackground,
    },
    buttonContent: {
      display: "flex",
      "align-items": "center",
      flex: 1,
      overflow: "hidden",
    },
    emoji: {
      "font-size": 18,
      "line-height": "normal",
    },
    icon: {
      "font-size": "20px !important",
      color: getColor,
    },
    label: {
      margin: "0 5px",
      flex: 1,
      color: getColor,
    },
    avatar: {
      border: ({ hover, selected, onClick, menu }: IStyles) => {
        const sel = ((!!onClick || !!menu) && hover) || selected;
        return `1px solid ${sel ? colorMain : "transparent"}`;
      },
      "box-sizing": "border-box",
      "border-radius": borderradius,
      height: `${size}px !important`,
      width: `${size}px !important`,
      transition: "250ms all",
      margin: "auto",
    },
    requiredSign: {
      color: "#ff0000",
      "margin-left": 2,
    },
  };
});

export default useStyles;
