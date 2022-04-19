import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import Typography from "@material-ui/core/Typography";
import ILabel from "./ILabel";
import { ILabelPositionX, ILabelPositionY } from "./ILabelPosition";

const useStyles = makeStyles({
  label: {
    position: "absolute",
    "max-width": 250,
    overflow: "hidden",
    "text-overflow": "ellipsis",
  },
  labelTopLeft: {
    top: "-20px",
    left: 5,
  },
  labelTopRight: {
    top: "-20px",
    right: 5,
  },
  labelBottomLeft: {
    bottom: "-20px",
    left: 5,
  },
  labelBottomRight: {
    bottom: "-20px",
    right: 5,
  },
  readOnly: {
    color: "#999999",
  },
});

const Label = ({
  className,
  label,
  required = false,
  positionX = ILabelPositionX.left,
  positionY = ILabelPositionY.top,
  readOnly = false,
  style,
}: ILabel) => {
  const classes = useStyles({});
  if (!label) return null;
  return (
    <Typography
      variant="body1"
      style={style}
      className={classnames({
        [classes.label]: true,
        [classes.labelTopLeft]:
          positionX === ILabelPositionX.left &&
          positionY === ILabelPositionY.top,
        [classes.labelTopRight]:
          positionX === ILabelPositionX.right &&
          positionY === ILabelPositionY.top,
        [classes.labelBottomLeft]:
          positionX === ILabelPositionX.left &&
          positionY === ILabelPositionY.bottom,
        [classes.labelBottomRight]:
          positionX === ILabelPositionX.right &&
          positionY === ILabelPositionY.bottom,
        [classes.readOnly]: readOnly,
        [className]: !!className,
      })}
    >
      {label}
      {!required ? null : <span style={{ color: "#FF0000" }} children=" *" />}
    </Typography>
  );
};

export default Label;
