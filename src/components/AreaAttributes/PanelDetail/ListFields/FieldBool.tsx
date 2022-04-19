import * as React from "react";
import FieldSelect, {
  IFieldSelectItem,
} from "../../../../componentsBase/Field/FieldSelect";
import { ACT_VPORT } from "../../reducer";
import IField from "./IField";
import getProps from "./getProps";
import { ContextDispatchViewport } from "../../contexts";

const idYes = "idYes";
const idNo = "idNo";

interface IFieldBool extends IField {
  value: boolean;
}

const FieldBool = ({
  id,
  label,
  value,
  readOnly,
  className,
  attributeType,
}: IFieldBool) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const onChange = React.useCallback(
    (item, array: IFieldSelectItem[]) => {
      const newItem = array.find(({ selected }) => selected);
      const newItemValue = !newItem ? undefined : newItem.id === idYes;
      const payload = [{ key: id, value: newItemValue }];

      if (id === "multiCatalog") {
        payload.push({
          key: "multiLanguage",
          value: undefined,
        });
      }

      dispatchViewport({
        type: ACT_VPORT.DETAIL_EDIT_KEYS,
        payload,
      });
    },
    [dispatchViewport, id]
  );

  return (
    <FieldSelect
      {...getProps({
        id,
        label,
        readOnly,
        attributeType,
      })}
      className={className}
      value={[
        {
          id: idYes,
          label: "Yes",
          selected: value === true,
        },
        {
          id: idNo,
          label: "No",
          selected: value === false,
        },
      ]}
      onChange={onChange}
      itemsSelectedMaxLength={1}
    />
  );
};

export default FieldBool;
