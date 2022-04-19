import * as React from "react";
import { ACT_VPORT } from "../reducer";
import SelectItems from "./SelectItems";
import { IProduct } from "../../../interfaces";
import { ContextDispatchViewport } from "../contexts";

interface IGridSelectItems {
  items: IProduct[];
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
  const onSelectMax = React.useCallback(() => {
    dispatchViewport({
      type: ACT_VPORT.SELECT_ITEM_MAX,
      selectingMaxItems: true,
    });
  }, [dispatchViewport]);

  return (
    <SelectItems
      items={items}
      itemsIdSelected={itemsIdSelected}
      onSelectCurrentPage={onSelectCurrentPage}
      onDeselect={onDeselect}
      onSelectMax={onSelectMax}
      itemsTotal={itemsTotal}
    />
  );
};

export default GridSelectItems;
