import { PopoverProps } from "@material-ui/core/Popover";
import * as React from "react";
import IAction from "./IAction";

interface IActionsMenu extends PopoverProps {
  PaperProps?: {
    className?: string;
    style?: React.CSSProperties;
  };
  actions?: IAction[];
  anchorPosition?: {
    top: number;
    left: number;
  };
  className?: string;
  open: boolean;
  onClose?: (event: React.MouseEvent) => void;
  title?: string;
}

export default IActionsMenu;
