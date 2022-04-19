import Icon from "@material-ui/core/Icon";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import hexToRgbA from "../../utils/hexToRgbA";
import { IAnnotation } from "../interfaces";

const useStyles = makeStyles({
  root: {
    "border-radius": "50%",
    "box-sizing": "border-box",
    position: "absolute" as const,
    left: 0,
    top: 0,
    height: 26,
    width: 26,
    transform: "translate3d(-50%, -50%, 0)",
    "box-shadow": "0 2px 4px rgba(0,0,0,0.2)",
  },
  icon: {
    position: "absolute" as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: "auto",
    "font-size": "14px !important",
    color: "#fff",
    "font-weight": "bold !important",
  },
});

interface ISelectorPoint {
  active?: boolean;
  annotation: IAnnotation;
  color: string;
}

const SelectorPoint = ({
  active = false,
  annotation,
  color = "#9a9a9a",
}: ISelectorPoint) => {
  const classes = useStyles({});
  return (
    <div
      className={classes.root}
      style={{
        top: `${annotation.geometry.y}%`,
        left: `${annotation.geometry.x}%`,
        backgroundColor: hexToRgbA(color, active ? 1 : 0.6),
        border: "2px solid #ffffff",
      }}
    >
      {annotation.data.resolved ? (
        <Icon className={classes.icon} children="check" />
      ) : null}
    </div>
  );
};

export default SelectorPoint;
