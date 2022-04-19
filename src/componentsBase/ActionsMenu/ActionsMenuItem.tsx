import * as React from "react";
import ListItem from "../ListItem";
import IAction from "./IAction";

const ActionsMenu = (p: IAction) => {
  const { onClose, onClick, label, disableClose } = p;

  const cbOnClick = React.useCallback(
    (event: React.MouseEvent, id: string, buttonId?: string) => {
      event.preventDefault();
      event.stopPropagation();
      onClick(event, id, buttonId);
      if (!disableClose) onClose(event);
    },
    [disableClose, onClick, onClose]
  );

  return <ListItem {...p} label={label} onClick={cbOnClick} />;
};

export default ActionsMenu;
