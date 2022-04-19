import { ICell } from "../../../componentsBase/CellView";
import { IFile, IPath, SheetLayout } from "../../../interfaces";

interface ICellItem extends ICell {
  data: IFile;
  focused: boolean;
  cuted: boolean;
  items: IFile[];
  itemsIdSelected: string[];
  detailSheet: SheetLayout;
  path: IPath[];
  hideActions: boolean;
}

export default ICellItem;
