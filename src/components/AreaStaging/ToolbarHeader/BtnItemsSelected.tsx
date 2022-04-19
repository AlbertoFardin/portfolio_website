import * as React from "react";
import isEmpty from "lodash-es/isEmpty";
import Btn from "../../../componentsBase/Btn";
import { ACT_VPORT } from "../reducer";
import { ContextDispatchViewport } from "../contexts";

interface IBtnItemsSelected {
  itemsIdSelected: string[];
  loadOnlySelected: boolean;
}

const BtnItemsSelected = ({
  itemsIdSelected,
  loadOnlySelected,
}: IBtnItemsSelected) => {
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
      onClick={onLoadOnlySelected}
      disabled={isEmpty(itemsIdSelected)}
    />
  );
};

export default BtnItemsSelected;
