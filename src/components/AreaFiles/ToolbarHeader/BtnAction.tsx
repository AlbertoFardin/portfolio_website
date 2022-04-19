import * as React from "react";
import Btn from "../../../componentsBase/Btn";
import { IAction } from "../actions";

const BtnAction = ({ id, icon, label, disabled, onClick }: IAction) => {
  const onClickCb = React.useCallback(
    (event) => {
      onClick(event, id);
    },
    [id, onClick]
  );
  return (
    <Btn icon={icon} tooltip={label} disabled={disabled} onClick={onClickCb} />
  );
};

export default BtnAction;
