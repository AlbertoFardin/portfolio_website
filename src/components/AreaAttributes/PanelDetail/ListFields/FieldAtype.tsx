import * as React from "react";
import FieldSelect, {
  IFieldSelectItem,
} from "../../../../componentsBase/Field/FieldSelect";
import { ATypeColumn, AttributeType } from "../../../../interfaces";
import { ACT_VPORT, typeDict } from "../../reducer";
import IField from "./IField";
import getProps from "./getProps";
import { ContextDispatchViewport } from "../../contexts";

interface IFieldAtype extends IField {
  value: ATypeColumn;
}

const FieldAtype = ({
  id,
  label,
  value,
  readOnly,
  className,
  attributeType,
}: IFieldAtype) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const onChange = React.useCallback(
    (item, array: IFieldSelectItem[]) => {
      const newItem = array.find(({ selected }) => selected);
      const newItemValue = newItem ? newItem.id : null;
      dispatchViewport({
        type: ACT_VPORT.DETAIL_EDIT_KEYS,
        payload: [
          { key: id, value: newItemValue },
          { key: "dictionary", value: null },
        ],
      });
    },
    [dispatchViewport, id]
  );
  const valueComplete = Object.values(ATypeColumn)
    .filter((type) => {
      // only if AttributeType.USER can create atype dicts
      return attributeType === AttributeType.USER || !typeDict.has(type);
    })
    .map((k) => ({
      id: k,
      selected: k === value,
      label: k,
    }));

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

export default FieldAtype;
