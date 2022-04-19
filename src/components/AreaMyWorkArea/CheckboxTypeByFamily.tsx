import Checkbox from "./Checkbox";
import * as React from "react";
import { IData, ConfigType } from "./interfaces";

interface ICheckboxTypeByFamily {
  attributeFamily: string;
  confType: ConfigType;
  datas: IData[];
  disabled?: boolean;
  onClick: (attributeFamily, confType, checked) => void;
  style?: React.CSSProperties;
}

const CheckboxTypeByFamily = ({
  attributeFamily,
  confType,
  onClick,
  datas,
  disabled = false,
  style,
}: ICheckboxTypeByFamily) => {
  const data = datas.find((d) => d.attributeFamily === attributeFamily);
  const justOneNotChecked = !!data.attributes.find(
    (a) => a[confType].enabled === false && a[confType].available
  );
  const justOneAvailable = !!data.attributes.find((a) => a[confType].available);
  const cbOnClick = React.useCallback(() => {
    onClick(attributeFamily, confType, justOneNotChecked);
  }, [attributeFamily, confType, justOneNotChecked, onClick]);

  return (
    <Checkbox
      style={style}
      disabled={justOneAvailable ? disabled : true}
      checked={justOneAvailable ? !justOneNotChecked : false}
      onClick={cbOnClick}
    />
  );
};

export default CheckboxTypeByFamily;
