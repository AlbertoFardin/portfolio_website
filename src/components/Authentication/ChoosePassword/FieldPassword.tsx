import * as React from "react";
import FieldText from "../../../componentsBase/Field/FieldText";
import Tooltip from "../../../componentsBase/Tooltip";

interface IFieldPassword {
  tooltipNode: JSX.Element;
  tooltipOpen: boolean;
  value: string;
  placeholder: string;
  onFocus?: () => void;
  onBlur?: (p: string) => void;
  onChange: (p: string) => void;
}

const FieldPassword = ({
  tooltipNode,
  tooltipOpen,
  value,
  placeholder,
  onFocus,
  onBlur,
  onChange,
}: IFieldPassword) => {
  return (
    <Tooltip title={tooltipNode} placement="right" open={tooltipOpen}>
      <div style={{ width: "100%", margin: "10px 0" }}>
        <FieldText
          style={{ width: "100%", margin: 0 }}
          debounce={0}
          value={value}
          placeholder={placeholder}
          type="password"
          autoComplete="new-password"
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
        />
      </div>
    </Tooltip>
  );
};

export default FieldPassword;
