import * as React from "react";
import Btn from "../../componentsBase/Btn";
import { IAction } from "./actions";

interface IBtnAction extends IAction {
  onClick: (event, id: string) => void;
}

const BtnAction = ({ id, icon, label, hidden, onClick }: IBtnAction) => {
  const onClickCb = React.useCallback(
    (event) => {
      onClick(event, id);
    },
    [id, onClick]
  );

  if (hidden) return null;

  return <Btn icon={icon} tooltip={label} onClick={onClickCb} />;
};

export default BtnAction;
