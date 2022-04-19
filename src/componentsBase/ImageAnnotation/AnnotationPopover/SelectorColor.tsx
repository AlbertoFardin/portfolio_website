import ButtonBase from "@material-ui/core/ButtonBase";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import * as React from "react";
import { IAnnotation } from "../interfaces";

const useStyles = makeStyles({
  root: {
    position: "relative",
    width: 18,
    height: 18,
    margin: 1,
    "border-radius": 100,
    "border-width": 0,
    "border-style": "solid",
    "& div": {
      "border-radius": 100,
      width: 12,
      height: 12,
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      margin: "auto",
    },
  },
  active: {
    "border-width": "1px !important",
  },
});

interface IBtnColor {
  active: boolean;
  color: string;
  onClick: (s: string) => void;
}
const BtnColor = ({ active, color, onClick }: IBtnColor) => {
  const classes = useStyles({});
  const cbOnClick = React.useCallback(() => onClick(color), [onClick, color]);
  return (
    <ButtonBase
      style={{ borderColor: color }}
      className={classnames({
        [classes.root]: true,
        [classes.active]: active,
      })}
      onClick={cbOnClick}
      children={<div style={{ backgroundColor: color }} />}
    />
  );
};

interface ISelectorColor {
  annotation: IAnnotation;
  colors: string[];
  onClick: (s: string) => void;
}

const SelectorColor = ({ annotation, colors, onClick }: ISelectorColor) => (
  <>
    {colors.map((c) => (
      <BtnColor
        key={c}
        active={c === annotation.data.color}
        color={c}
        onClick={onClick}
      />
    ))}
  </>
);

export default SelectorColor;
