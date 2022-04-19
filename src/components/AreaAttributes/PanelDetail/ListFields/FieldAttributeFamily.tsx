import * as React from "react";
import FieldSelect, {
  IFieldSelectItem,
} from "../../../../componentsBase/Field/FieldSelect";
import { AttributeFamily, AttributeType } from "../../../../interfaces";
import { ACT_VPORT } from "../../reducer";
import IField from "./IField";
import getProps from "./getProps";
import { ContextDispatchViewport } from "../../contexts";

interface IFieldAttributeFamily extends IField {
  value: AttributeType;
}

const FieldAttributeFamily = ({
  id,
  label,
  value,
  readOnly,
  className,
  attributeType,
}: IFieldAttributeFamily) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const onChange = React.useCallback(
    (item, array: IFieldSelectItem[]) => {
      const newItem = array.find(({ selected }) => selected);
      const newItemValue = newItem ? newItem.id : null;
      dispatchViewport({
        type: ACT_VPORT.DETAIL_EDIT_KEYS,
        payload: [{ key: id, value: newItemValue }],
      });
    },
    [dispatchViewport, id]
  );
  const valueComplete = Object.values(AttributeFamily)
    .sort()
    .reduce((acc, k) => {
      if (k === AttributeFamily.MEDIA) return acc;

      acc.push({
        id: k,
        selected: k === String(value),
        label: k,
      });
      return acc;
    }, []);

  if (value === AttributeType.SYSTEM) return null;

  return (
    <FieldSelect
      {...getProps({
        id,
        label,
        readOnly,
        attributeType,
      })}
      className={className}
      value={valueComplete}
      onChange={onChange}
      itemsSelectedMaxLength={1}
    />
  );
};

export default FieldAttributeFamily;
