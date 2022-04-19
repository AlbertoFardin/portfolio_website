import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import Tooltip from "../../../componentsBase/Tooltip";
import mixColors from "../../../componentsBase/utils/mixColors";
import { colorTheme } from "../../../constants";

interface IStyles {
  checked: boolean;
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
    "margin-right": 5,
    color: ({ checked, color }: IStyles) => (checked ? color : "#CBCBCB"),
  },
  label: {
    "font-weight": "bold",
  },
});

interface IFooterCheckbox {
  label: JSX.Element | string;
  color?: string;
  checked: boolean;
  onClick: () => void;
  tootip?: string;
}

const FooterCheckbox = ({
  label,
  checked,
  onClick,
  tootip = "",
  color = colorTheme,
}: IFooterCheckbox) => {
  const classes = useStyles({ checked, color });
  return (
    <Tooltip title={tootip}>
      <ButtonBase className={classes.checkbox} onClick={onClick}>
        <Icon
          className={classes.icon}
          children={checked ? "check_box" : "check_box_outline_blank"}
        />
        <Typography
          className={classes.label}
          variant="body1"
          children={label}
        />
      </ButtonBase>
    </Tooltip>
  );
};

export default FooterCheckbox;
