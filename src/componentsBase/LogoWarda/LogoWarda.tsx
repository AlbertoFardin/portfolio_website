import ButtonBase from "@material-ui/core/ButtonBase";
import * as React from "react";
import { ILogoWarda } from ".";
import { Weight } from "./Weight";
import Light from "./weight/light";
import Medium from "./weight/medium";
import Regular from "./weight/regular";

const LogoWarda = ({
  className,
  style,
  color = "#000",
  height = 50,
  onClick,
  weight = Weight.medium,
  width = 150,
}: ILogoWarda) => (
  <ButtonBase
    className={className}
    style={{
      width,
      height,
      padding: 0,
      margin: 0,
      boxSizing: "content-box",
      cursor: onClick ? "pointer" : "default",
      ...style,
    }}
    disableRipple={!onClick}
    onClick={onClick}
  >
    {(() => {
      const p = { width, height, color };
      switch (weight) {
        case Weight.light:
          return <Light {...p} />;
        case Weight.regular:
          return <Regular {...p} />;
        default:
          return <Medium {...p} />;
      }
    })()}
  </ButtonBase>
);

LogoWarda.Weight = Weight;

export default LogoWarda;
