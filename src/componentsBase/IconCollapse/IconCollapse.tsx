import Icon from "@material-ui/core/Icon";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import * as React from "react";
import IIconCollapse from "./IIconCollapse";

const useStyle = makeStyles({
  icon: {
    color: "#333",
    "margin-right": 10,
    "font-size": "16px !important",
    transition: "all 250ms",
    cursor: "pointer",
  },
  iconCollapsed: {
    transform: "rotate(-90deg)",
  },
});

/** **IconCollapse** is an arrow icon used on pannel expanded and collapsed */
const IconCollapse = ({
  className,
  collapse,
  onClick,
  style,
}: IIconCollapse) => {
  const classes = useStyle({});
  return (
    <Icon
      className={classnames({
        [classes.icon]: true,
        [classes.iconCollapsed]: collapse,
        [className]: !!className,
      })}
      style={style}
      onClick={onClick}
      children="keyboard_arrow_down"
    />
  );
};

export default IconCollapse;
