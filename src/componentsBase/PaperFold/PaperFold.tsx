import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import * as React from "react";
import { IPaperFold } from ".";

interface IStyles {
  size: number;
  radius: number;
  color: string;
}

const useStyles = makeStyles({
  paperfold: {
    position: "absolute",
    "z-index": 2,
    "background-color": "#ffffff",
    transition: "border-width 250ms",
    "border-width": 0,
    "border-style": "solid",
  },
  anchorTopLeft: {
    top: 0,
    left: 0,
    "border-top-color": "transparent",
    "border-right-color": (p: IStyles) => p.color,
    "border-bottom-color": (p: IStyles) => p.color,
    "border-left-color": "transparent",
    "border-top-left-radius": (p: IStyles) => p.radius,
    "border-top-right-radius": 0,
    "border-bottom-right-radius": (p: IStyles) => p.radius,
    "border-bottom-left-radius": 0,
    "box-shadow": "4px 4px 5px 0 rgba(0, 0, 0, 0.2)",
  },
  anchorTopRight: {
    top: 0,
    right: 0,
    "border-top-color": "transparent",
    "border-right-color": "transparent",
    "border-bottom-color": (p: IStyles) => p.color,
    "border-left-color": (p: IStyles) => p.color,
    "border-top-left-radius": 0,
    "border-top-right-radius": (p: IStyles) => p.radius,
    "border-bottom-right-radius": 0,
    "border-bottom-left-radius": (p: IStyles) => p.radius,
    "box-shadow": "-4px 4px 5px 0 rgba(0, 0, 0, 0.2)",
  },
  anchorBottomLeft: {
    bottom: 0,
    left: 0,
    "border-top-color": (p: IStyles) => p.color,
    "border-right-color": (p: IStyles) => p.color,
    "border-bottom-color": "transparent",
    "border-left-color": "transparent",
    "border-top-left-radius": 0,
    "border-top-right-radius": (p: IStyles) => p.radius,
    "border-bottom-right-radius": 0,
    "border-bottom-left-radius": (p: IStyles) => p.radius,
    "box-shadow": "4px -4px 5px 0 rgba(0, 0, 0, 0.2)",
  },
  anchorBottomRight: {
    bottom: 0,
    right: 0,
    "border-top-color": (p: IStyles) => p.color,
    "border-right-color": "transparent",
    "border-bottom-color": "transparent",
    "border-left-color": (p: IStyles) => p.color,
    "border-top-left-radius": (p: IStyles) => p.radius,
    "border-top-right-radius": 0,
    "border-bottom-right-radius": (p: IStyles) => p.radius,
    "border-bottom-left-radius": 0,
    "box-shadow": "-4px -4px 5px 0 rgba(0, 0, 0, 0.2)",
  },
  open: {
    "border-width": (p: IStyles) => p.size,
  },
});

const PaperFold = ({
  anchorVertical = "top",
  anchorHorizontal = "left",
  className,
  color = "#f7f7f7",
  open,
  style,
  size = 13,
}: IPaperFold) => {
  const classes = useStyles({
    size: size + 2,
    radius: size - 3,
    color,
  });
  return (
    <div
      style={style}
      className={classnames({
        [className]: !!className,
        [classes.paperfold]: true,
        [classes.open]: open,
        [classes.anchorTopLeft]:
          anchorVertical === "top" && anchorHorizontal === "left",
        [classes.anchorTopRight]:
          anchorVertical === "top" && anchorHorizontal === "right",
        [classes.anchorBottomLeft]:
          anchorVertical === "bottom" && anchorHorizontal === "left",
        [classes.anchorBottomRight]:
          anchorVertical === "bottom" && anchorHorizontal === "right",
      })}
    />
  );
};

export default React.memo(PaperFold);
