import * as React from "react";
import { ViewType } from "../../../../interfaces";
import getSelectValue from "./getSelectValue";
import Select, { ISelect } from "./Select";

const SelectViewType = ({
  fieldKey,
  viewDraft,
  items,
  disabled,
  onChange,
}: ISelect) => {
  const menuValues = Object.values(ViewType);
  const { value, placeholder } = getSelectValue({
    key: fieldKey,
    viewDraft,
    items,
  });
  const onClick = React.useCallback(
    (event, actionId) => {
      onChange(fieldKey, actionId);
    },
    [fieldKey, onChange]
  );

  return (
    <Select
      fieldKey={fieldKey}
      viewDraft={viewDraft}
      variant={!disabled && placeholder ? "bold" : "light"}
      label={value}
      labelRequired={value === ViewType.MANDATORY}
      disabled={disabled}
      menu={menuValues.map((k) => ({
        id: k,
        label: k,
        active: k === value,
        onClick,
      }))}
    />
  );
};

export default SelectViewType;
