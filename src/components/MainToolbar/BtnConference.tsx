import * as React from "react";
import * as Colors from "../../componentsBase/style/Colors";
import Btn, { IBtn } from "../../componentsBase/Btn";

const BtnConference = (p: IBtn) => {
  const { disabled, tooltip, selected, onClick } = p;
  return (
    <Btn
      {...p}
      variant={"bold"}
      color={selected ? Colors.Green : "#000"}
      icon="videocam"
      onClick={onClick}
      disabled={disabled}
      tooltip={disabled ? "To enable reach out system administrator" : tooltip}
    />
  );
};

export default BtnConference;
