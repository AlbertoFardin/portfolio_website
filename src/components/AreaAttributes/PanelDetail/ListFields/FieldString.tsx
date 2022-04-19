import * as React from "react";
import FieldText from "../../../../componentsBase/Field/FieldText";
import { ACT_VPORT } from "../../reducer";
import IField from "./IField";
import getProps from "./getProps";
import { ContextDispatchViewport } from "../../contexts";

interface IFieldString extends IField {
  value: string;
}

const FieldString = ({
  id,
  label,
  value,
  readOnly,
  className,
  attributeType,
}: IFieldString) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const onChange = React.useCallback(
    (newValue: string) => {
      dispatchViewport({
        type: ACT_VPORT.DETAIL_EDIT_KEYS,
        payload: [{ key: id, value: newValue || undefined }],
      });
    },
    [dispatchViewport, id]
  );

  return (
    <FieldText
      {...getProps({
        id,
        label,
        readOnly,
        attributeType,
      })}
      className={className}
      value={value}
      onChange={onChange}
    />
  );
};

export default FieldString;
