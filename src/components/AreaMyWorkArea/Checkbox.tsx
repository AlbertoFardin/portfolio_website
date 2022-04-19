import * as React from "react";
import { ButtonBase, Icon } from "@material-ui/core";
import { colorTheme } from "../../constants";
import makeStyles from "@material-ui/core/styles/makeStyles";
import mixColors from "../../componentsBase/utils/mixColors";

interface IStyles {
  checked: boolean;
  disabled: boolean;
  color: string;
}

const useStyles = makeStyles({
  checkbox: {
    display: "flex",
    "flex-direction": "row",
    "justify-content": "start",
    "align-items": "center",
    padding: "5px 8px 5px 5px",
    "border-radius": 5,
    color: ({ color }: IStyles) => color,
    "background-color": ({ checked, color }: IStyles) =>
      checked ? mixColors(0.15, "#ffffff", color) : "transparent",
    "margin-right": 10,
  },
  icon: {
    "font-size": "16px !important",
    "margin-right": 0,
    width: 14,
    height: 14,
    color: ({ checked, color }: IStyles) => (checked ? color : "#CBCBCB"),
    "background-color": ({ disabled }: IStyles) =>
      disabled ? "#CBCBCB" : "transparent",
  },
});

const Checkbox = ({
  checked,
  onClick,
  style,
  disabled,
  color = colorTheme,
}) => {
  const classes = useStyles({ checked, color, disabled });
  const cbOnClick = React.useCallback(() => {
    onClick(!checked);
  }, [checked, onClick]);
  return (
    <div style={style}>
      <ButtonBase
        className={classes.checkbox}
        onClick={cbOnClick}
        disabled={disabled}
      >
        <Icon
          className={classes.icon}
          children={checked ? "check_box" : "check_box_outline_blank"}
        />
      </ButtonBase>
    </div>
  );
};

export default Checkbox;
