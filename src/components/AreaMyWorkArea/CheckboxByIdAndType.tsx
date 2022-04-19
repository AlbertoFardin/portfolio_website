import Checkbox from "./Checkbox";
import * as React from "react";
import { ConfigType } from "./interfaces";

interface ICheckboxByIdAndType {
  id: string;
  confType: ConfigType;
  checked: boolean;
  disabled: boolean;
  style?: React.CSSProperties;
  onClick: (id, confType, checked) => void;
}

const CheckboxByIdAndType = ({
  id,
  confType,
  disabled,
  checked,
  onClick,
  style,
}: ICheckboxByIdAndType) => {
  const cbOnClick = React.useCallback(() => {
    onClick(id, confType, !checked);
  }, [onClick, id, confType, checked]);

  return (
    <Checkbox
      style={style}
      disabled={disabled}
      checked={checked}
      onClick={cbOnClick}
    />
  );
};

export default CheckboxByIdAndType;
