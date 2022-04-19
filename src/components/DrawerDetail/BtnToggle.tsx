import * as React from "react";
import Btn from "../../componentsBase/Btn";
import { SheetLayout } from "../../interfaces";

interface IBtnToggle {
  disabled?: boolean;
  layout: SheetLayout;
  onChange: (l: SheetLayout) => void;
}

const BtnToggle = ({ disabled, layout, onChange }: IBtnToggle) => {
  const fullscreen = layout === SheetLayout.FULLSCREEN;
  const onClick = React.useCallback(() => {
    onChange(fullscreen ? SheetLayout.OPENED : SheetLayout.FULLSCREEN);
  }, [onChange, fullscreen]);

  return (
    <Btn
      disabled={disabled}
      icon={fullscreen ? "fullscreen_exit" : "fullscreen"}
      tooltip={fullscreen ? "Details Panel" : "Details Fullscreen"}
      onClick={onClick}
    />
  );
};

export default BtnToggle;
