import IAction from "../../ActionsMenu/IAction";
import { IBtn } from "../../Btn";
import { ICellClick, IRenderCellContent, IColumn } from "../interfaces";

export interface ICellContentData {
  value;
  column: IColumn;
  selected?: boolean;
  focused?: boolean;
  rowThumbnailSize: number;
  rowContextmenu?: IAction[];
  rowOnClick?: (p: ICellClick) => void;
  rowOnContextMenu?: (p: ICellClick) => void;
  rowOnDoubleClick?: (p: ICellClick) => void;
  rowOnCopyToClipboard?: (s: string) => void;
  renderCell?: (p: IRenderCellContent) => JSX.Element;
  renderPlaceholder?: (p: IRenderCellContent) => JSX.Element;
  mapError?: { [keyError: string]: IBtn };
}
export interface ICellContent {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: ICellContentData;
}

export default ICellContent;
