import * as React from "react";
import Btn from "../../../componentsBase/Btn";
import * as Colors from "../../../componentsBase/style/Colors";

interface IFooter {
  disabledAssign?: boolean;
  disabledUnassign?: boolean;
  onAssign: () => void;
  onUnassign: () => void;
  onCancel: () => void;
}

const Footer = ({
  disabledAssign = false,
  disabledUnassign = false,
  onAssign,
  onUnassign,
  onCancel,
}: IFooter) => {
  return (
    <>
      <div style={{ flex: 1 }} />
      <Btn variant="bold" label="CANCEL" onClick={onCancel} />
      <Btn
        variant="bold"
        color={Colors.Red}
        label="UNASSIGN"
        onClick={onUnassign}
        disabled={disabledUnassign}
      />
      <Btn
        variant="bold"
        color={Colors.Green}
        label="ASSIGN"
        onClick={onAssign}
        disabled={disabledAssign}
      />
    </>
  );
};

export default Footer;
