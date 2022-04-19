import { IActions } from "../../../ActionsMenu";
import { ICellClick } from "../../interfaces";

interface ICellString {
  value: string;
  rowIndex: number;
  columnIndex: number;
  selected: boolean;
  focused: boolean;
  style: React.CSSProperties;
  contextmenu: IActions[];
  onClick: (p: ICellClick) => void;
  onDoubleClick: (p: ICellClick) => void;
  onContextMenu: (p: ICellClick) => void;
  onCopyToClipboard?: (s: string) => void;
}

export default ICellString;
