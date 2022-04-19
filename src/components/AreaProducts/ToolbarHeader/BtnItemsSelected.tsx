import * as React from "react";
import Btn from "../../../componentsBase/Btn";
import { ACT_VPORT } from "../reducer";
import { MAX_PRODUCTS_MASSIVE_ACTIONS } from "../../../constants";
import { ContextDispatchViewport } from "../contexts";

interface IToolbarHeader {
  itemsIdSelected: string[];
  loadOnlySelected: boolean;
}

const ToolbarHeader = ({
  loadOnlySelected,
  itemsIdSelected,
}: IToolbarHeader) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const count = itemsIdSelected.length;
  const onLoadOnlySelected = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.LOAD_ONLY_SELECTED });
  }, [dispatchViewport]);

  return (
    <Btn
      icon="remove_red_eye"
      label={String(count)}
      selected={loadOnlySelected}
      tooltip={`${count} item${count > 1 ? "s" : ""} selected`}
      disabled={
        itemsIdSelected.length > MAX_PRODUCTS_MASSIVE_ACTIONS ||
        itemsIdSelected.length === 0
      }
      onClick={onLoadOnlySelected}
    />
  );
};

export default ToolbarHeader;
