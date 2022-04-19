import * as React from "react";
import { ACT_VPORT } from "../reducer";
import SelectItems from "../../AreaProducts/ToolbarHeader/SelectItems";
import { IItemEs, IItemStagingArea } from "../../../interfaces";
import { ContextDispatchViewport } from "../contexts";
import { KEY_ROOT_ID } from "../../../constants";

interface IGridSelectItems {
  items: IItemEs<IItemStagingArea>[];
  itemsIdSelected: string[];
  itemsTotal: number;
}

const GridSelectItems = ({
  items,
  itemsIdSelected,
  itemsTotal,
}: IGridSelectItems) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const onSelectCurrentPage = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.ITEMS_SELECT_ALL });
  }, [dispatchViewport]);
  const onDeselect = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.ITEMS_DESELECT });
  }, [dispatchViewport]);
  const itemsForSelect = React.useMemo(() => {
    return items.map((item) => ({
      id: item.id,
      [KEY_ROOT_ID]: "",
      version: 0,
      ...item.data,
    }));
  }, [items]);

  return (
    <SelectItems
      items={itemsForSelect}
      itemsIdSelected={itemsIdSelected}
      onSelectCurrentPage={onSelectCurrentPage}
      onDeselect={onDeselect}
      itemsTotal={itemsTotal}
    />
  );
};

export default GridSelectItems;
