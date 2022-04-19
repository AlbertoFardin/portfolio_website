import * as React from "react";
import Btn from "../../../Btn";

const ToolbarButton = (props: {
  id: string;
  active: boolean;
  label: string;
  style: string;
  type: string;
  icon: string;
  disabled: boolean;
  action: (style: string, type: string, id: string) => void;
}) => {
  const { id, active, label, style, type, icon, action, disabled } = props;
  const onClick = React.useCallback(() => {
    action(style, type, id + type);
  }, [action, id, style, type]);

  return (
    <Btn
      selected={active}
      key={`key-${label}`}
      tooltip={label}
      onClick={onClick}
      icon={icon}
      disabled={disabled}
      style={{ margin: "3px 8px" }}
    />
  );
};

export default ToolbarButton;
