import * as React from "react";
import isEmpty from "lodash-es/isEmpty";
import Btn from "../../Btn";
import { IActions } from "../../ActionsMenu";

interface IBtnMenu {
  onClose: () => void;
  inputHover?: boolean;
  readOnly: boolean;
  items: IActions[];
  disabled: boolean;
  visibleOnHover: boolean;
  renderDefault?;
  onMouseEnter?: (event: React.MouseEvent<Element, MouseEvent>) => void;
  onMouseLeave?: (event: React.MouseEvent<Element, MouseEvent>) => void;
}

const BtnMenu = ({
  onClose,
  inputHover = false,
  readOnly,
  items,
  disabled,
  visibleOnHover,
  renderDefault = null,
  onMouseEnter,
  onMouseLeave,
}: IBtnMenu) => {
  const isRenderDefault =
    isEmpty(items) || readOnly || (visibleOnHover && !inputHover);

  if (isRenderDefault) return renderDefault;

  return (
    <Btn
      style={{
        position: "absolute",
        bottom: 5,
        right: 5,
        margin: 0,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      icon="more_vert"
      menu={{
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "right",
        },
        onClose,
        items,
      }}
    />
  );
};

export default BtnMenu;
