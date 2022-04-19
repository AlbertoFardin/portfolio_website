import { IFileDetail } from "../../../interfaces";
import isEmpty from "lodash-es/isEmpty";
import { ACTION } from "../reducer";
import {
  multiSelectShift,
  multiSelectCtrl,
} from "../../../componentsBase/utils/grid";

interface IOnItemClick {
  dispatch: React.Dispatch<unknown>;
  items: IFileDetail[];
  itemsIdSelected: string[];
  itemLastSelectedIndex: number;
  data: IFileDetail;
  selected: boolean;
  ctrlDown: boolean;
  shiftKey: boolean;
}

const onItemClick = ({
  dispatch,
  items,
  itemsIdSelected,
  itemLastSelectedIndex,
  data,
  selected,
  ctrlDown,
  shiftKey,
}: IOnItemClick) => {
  const { id } = data;
  const itemData = items.find((i) => i.id === id);
  const itemIndex = items.findIndex((i) => i.id === id);
  const contentItemsSelected = itemsIdSelected.map((i) => ({ id: i }));
  const fireEvent = (itemsSel) => {
    if (isEmpty(itemsSel)) {
      dispatch({ type: ACTION.ITEMS_DESELECT });
    } else {
      dispatch({
        type: ACTION.ITEMS_SELECT,
        itemsIdSelected: itemsSel.map((i) => i.id),
        assetDataId: id,
      });
    }
  };

  if (shiftKey) {
    // multi selection with shift
    return fireEvent(
      multiSelectShift({
        indexItemSelected: itemLastSelectedIndex,
        indexItemClick: itemIndex,
        itemsSelected: contentItemsSelected,
        items: items,
      })
    );
  }

  if (ctrlDown) {
    // multi selection with ctrl
    dispatch({ type: ACTION.ITEM_LAST_SELECTED_INDEX, payload: itemIndex });
    return fireEvent(
      multiSelectCtrl({
        itemsSelected: contentItemsSelected,
        items: items,
        selected: selected,
        data: itemData,
      })
    );
  }

  // single selection
  dispatch({ type: ACTION.ITEM_LAST_SELECTED_INDEX, payload: itemIndex });
  return fireEvent([itemData]);
};

export default onItemClick;
