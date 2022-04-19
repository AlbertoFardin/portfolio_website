import * as React from "react";
import { MediaType } from "../../../../interfaces";
import getMediaTypeIcon from "../../../../utils/getMediaTypeIcon";
import getMediaTypeLabel from "../../../../utils/getMediaTypeLabel";
import getSelectValue from "./getSelectValue";
import Select, { ISelect } from "./Select";

const SelectMediaType = ({
  fieldKey,
  viewDraft,
  items,
  disabled,
  onChange,
}: ISelect) => {
  const menuValues = [MediaType.IMAGE_S, MediaType.IMAGE_P, MediaType.VIDEO];
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
      label={placeholder ? value : getMediaTypeLabel(value)}
      disabled={disabled}
      menu={menuValues.map((k) => ({
        id: k,
        label: getMediaTypeLabel(k),
        icon: getMediaTypeIcon(k),
        active: k === value,
        onClick,
      }))}
    />
  );
};

export default SelectMediaType;
