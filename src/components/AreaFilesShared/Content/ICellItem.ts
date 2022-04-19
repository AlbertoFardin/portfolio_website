import { ICell } from "../../../componentsBase/CellView";
import { IFileDetail } from "../../../interfaces";

interface ICellItem extends ICell {
  dispatch: React.Dispatch<unknown>;
  data: IFileDetail;
  focused: boolean;
  items: IFileDetail[];
  itemsIdSelected: string[];
  itemLastSelectedIndex: number;
  detailOpen: boolean;
}

export default ICellItem;
