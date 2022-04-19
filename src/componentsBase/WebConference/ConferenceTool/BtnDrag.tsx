import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import Btn from "../../Btn";

const useStyles = makeStyles({
  dragIcon: {
    cursor: "move !important",
    "margin-right": "0 !important",
  },
});

interface IBtnToggle {
  className?: string;
}

const BtnToggle = ({ className }: IBtnToggle) => {
  const classes = useStyles({});
  return (
    <Btn
      className={classnames({
        [classes.dragIcon]: true,
        [className]: !!className,
      })}
      icon="drag_indicator"
    />
  );
};

export default BtnToggle;
