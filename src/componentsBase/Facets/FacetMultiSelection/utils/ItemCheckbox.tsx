import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Zoom from "@material-ui/core/Zoom";

export enum Type {
  RADIO = "RADIO",
  CHECK = "CHECK",
}

export interface ICheckbox {
  selected: boolean;
  type: Type;
  visibility?: boolean;
}

const size = 10;
const useStyles = makeStyles(({ palette }) => {
  const colorTheme = palette.primary.main;
  return {
    checkbox: {
      display: "flex",
      "align-items": "center",
      "background-color": "#fff",
      overflow: "hidden",
      "min-height": size,
      height: size,
      "min-width": size,
      width: size,
      border: ({ selected }: ICheckbox) =>
        `1px solid ${selected ? colorTheme : "#E6E6E6"}`,
      "margin-right": 12,
      "border-radius": ({ type }: ICheckbox) => (type === Type.RADIO ? 100 : 3),
      opacity: ({ visibility }: ICheckbox) => (visibility ? 1 : 0),
    },
    checkboxContent: {
      width: ({ type }: ICheckbox) =>
        type === Type.RADIO ? size - 2 : "inherit",
      height: ({ type }: ICheckbox) =>
        type === Type.RADIO ? size - 2 : "inherit",
      "border-radius": ({ type }: ICheckbox) => (type === Type.RADIO ? 100 : 1),
      "background-color": colorTheme,
    },
    flex1: {
      flex: 1,
    },
  };
});

const Checkbox = (p: ICheckbox) => {
  const classes = useStyles(p);
  return (
    <div className={classes.checkbox}>
      <div className={classes.flex1} />
      <Zoom in={p.selected}>
        <div className={classes.checkboxContent} />
      </Zoom>
      <div className={classes.flex1} />
    </div>
  );
};

export default Checkbox;
