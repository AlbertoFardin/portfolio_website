import * as React from "react";
import { IconProps } from "@material-ui/core/Icon";
import { IActions } from "../ActionsMenu";
import { ITypographyEllipsis } from "../TypographyEllipsis";

interface IClick {
  id: string;
  keyCtrlDown: boolean;
  keyShiftDown: boolean;
}

interface IAssetFolder {
  id: string;
  children?: React.ReactNode | JSX.Element;
  className?: string;
  contextmenu?: IActions[];
  label?: string;
  labelProps?: ITypographyEllipsis;
  icon?: string;
  iconProps?: IconProps;
  onClick?: (e: React.MouseEvent, p: IClick) => void;
  onDoubleClick?: (e: React.MouseEvent, p: IClick) => void;
  onContextMenu?: (e: React.MouseEvent, p: IClick) => void;
  colorTheme: string;
  selected?: boolean;
  style?: React.CSSProperties;
}

export default IAssetFolder;
