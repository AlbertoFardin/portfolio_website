import * as React from "react";
import { PopoverOrigin } from "@material-ui/core/Popover";
import { IActions } from "../ActionsMenu";

interface IBtn {
  /** button style variant:
   *
   * * light: button's background is transparent and it's visible on mouse hover
   * * bold: button's bacground is always visible
   */
  variant?: "light" | "bold";
  /** button main color */
  color?: string;
  /** button CSS classes */
  className?: string;
  /** button CSS style */
  style?: React.CSSProperties;
  /** icon to render */
  icon?: string;
  /** icon CSS classes */
  iconClassName?: string;
  /** icon CSS style */
  iconStyle?: React.CSSProperties;
  /** emoji to render */
  emoji?: string;
  /** emoji CSS classes */
  emojiClassName?: string;
  /** emoji CSS style */
  emojiStyle?: React.CSSProperties;
  /** label to render */
  label?: string;
  /** label CSS classes */
  labelClassName?: string;
  /** label CSS style */
  labelStyle?: React.CSSProperties;
  /** label position to render in refers to icon and emoji */
  labelPosition?: "right" | "left";
  /** label show a red asterisk to the right */
  labelRequired?: boolean;
  /** if valued, copy to clipboard this text */
  copyToClipboard?: string;
  /** avatar */
  avatar?: string;
  /** avatar CSS classes */
  avatarClassName?: string;
  /** avatar CSS style */
  avatarStyle?: React.CSSProperties;
  /** disable component */
  disabled?: boolean;
  /** callback fired when mouse enter */
  onMouseEnter?: (event: React.MouseEvent) => void;
  /** callback fired when mouse leave */
  onMouseLeave?: (event: React.MouseEvent) => void;
  /** callback fired click */
  onClick?: (event: React.MouseEvent) => void;
  /** set component highlight */
  selected?: boolean;
  /** button tooltip */
  tooltip?: string | React.ReactNode | Element[];
  /** focus on tab click */
  focusRipple?: boolean;
  /** menu config */
  menu?: {
    icon?: boolean;
    iconClassName?: string;
    iconStyle?: React.CSSProperties;
    anchorOrigin?: PopoverOrigin;
    transformOrigin?: PopoverOrigin;
    onClose?: () => void;
    items: IActions[];
    title?: string;
  };
  upload?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChangeInput?: (event: any) => void;
    acceptFiles?: string;
    directory?: string;
    multiple?: boolean;
  };
  /** the tabIndex value. */
  tabIndex?: 0 | -1;
}

export default IBtn;
