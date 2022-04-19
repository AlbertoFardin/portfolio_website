import * as React from "react";
import FieldSelect, {
  IFieldSelectItem,
} from "../../../../componentsBase/Field/FieldSelect";
import { AttributeType } from "../../../../interfaces";
import { ACT_VPORT } from "../../reducer";
import getProps from "./getProps";
import { ContextDispatchViewport } from "../../contexts";

const id = "attributeType";
const label = "attributeType";

interface IFieldAttributeType {
  value: AttributeType;
  readOnly: boolean;
}

const FieldAttributeType = ({ value, readOnly }: IFieldAttributeType) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const onChange = React.useCallback(
    (item, array: IFieldSelectItem[]) => {
      const newItem = array.find(({ selected }) => selected);
      const newItemValue = newItem ? newItem.id : null;
      dispatchViewport({
        type: ACT_VPORT.DETAIL_EDIT_TYPE,
        value: newItemValue,
      });
    },
    [dispatchViewport]
  );
  const valueComplete = Object.values(AttributeType).map((k) => ({
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
      })}
      value={valueComplete}
      style={{
        margin: "25px 7px 5px",
        width: "-webkit-fill-available",
      }}
      onChange={onChange}
      itemsSelectedMaxLength={1}
    />
  );
};

export default FieldAttributeType;
