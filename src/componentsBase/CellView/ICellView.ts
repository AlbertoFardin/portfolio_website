import { ICell } from ".";
import { IActions } from "../ActionsMenu";
import { ICellViewItem } from "./utils";

export interface ICellView {
  cellHeight: (cellType: string) => number;
  cellWidth: number;
  cellRender: (props: ICell) => JSX.Element;
  className?: string;
  colorTheme: string;
  contextmenu?: IActions[];
  headers?: (cellType: string) => string;
  items: ICellViewItem[];
  itemsSelectedId?: (string | number)[];
  onClick?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
