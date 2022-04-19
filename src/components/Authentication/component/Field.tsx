/* eslint-disable jsx-a11y/no-autofocus */
import * as React from "react";
import FieldText from "../../../componentsBase/Field/FieldText";

interface IField {
  icon: string;
  keyField: string;
  label: string;
  onChangeInput: (key: string, value: string) => void;
  onEnter?: () => void;
  type?: string;
  autoComplete: string;
  value: string;
  readOnly?: boolean;
}

const Field = ({
  icon,
  keyField,
  label,
  onChangeInput,
  onEnter,
  type,
  autoComplete,
  value,
  readOnly,
}: IField) => {
  const inputRef = React.useRef(null);
  const cbOnChange = React.useCallback(
    (v: string) => {
      onChangeInput(keyField, v);
    },
    [keyField, onChangeInput]
  );
  const onKeyPress = React.useCallback(
    (key: string) => {
      if (key === "Enter" && onEnter) onEnter();
    },
    [onEnter]
  );

  return (
    <FieldText
      inputRef={inputRef}
      label={label}
      value={value}
      onChange={cbOnChange}
      type={type}
      autoComplete={autoComplete}
      adornmentIcon={icon}
      onKeyPress={onKeyPress}
      readOnly={readOnly}
    />
  );
};

export default Field;
