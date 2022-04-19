import * as React from "react";
import { IActions } from "../ActionsMenu";
import PreviewType from "../Preview/PreviewType";
import { ITypographyEllipsis } from "../TypographyEllipsis";

interface IClick {
  id: string;
  keyCtrlDown: boolean;
  keyShiftDown: boolean;
}

interface IAssetPreview {
  id: string;
  children?: React.ReactNode;
  className?: string;
  colorTheme: string;
  contextmenu?: IActions[];
  label?: string;
  labelProps?: ITypographyEllipsis;
  onClick?: (e: React.MouseEvent, p: IClick) => void;
  onDoubleClick?: (e: React.MouseEvent, p: IClick) => void;
  onContextMenu?: (e: React.MouseEvent, p: IClick) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  placeholderIcon?: string;
  placeholderIconStyle?: React.CSSProperties;
  placeholderLabel?: string;
  placeholderLabelStyle?: React.CSSProperties;
  placeholderLabelRequired?: boolean;
  selected?: boolean;
  style?: { [k: string]: string | number };
  srcUrl: string;
  srcType: PreviewType;
}

export default IAssetPreview;
