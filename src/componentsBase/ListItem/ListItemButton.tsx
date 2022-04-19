import * as React from "react";
import IListItemButton from "./IListItemButton";
import Btn from "../Btn";

interface IListItemButtonCmp extends IListItemButton {
  parentId: string;
}

const ListItemButton = (b: IListItemButtonCmp) => {
  const { onClick, parentId, id, disabled } = b;
  const onCbClick = React.useCallback(
    (event) => {
      if (!disabled && !!onClick) {
        event.stopPropagation();
        onClick(event, parentId, id);
      }
    },
    [disabled, id, onClick, parentId]
  );

  return <Btn {...b} tabIndex={-1} onClick={onCbClick} />;
};

export default ListItemButton;
