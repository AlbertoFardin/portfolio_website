import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import Icon from "@material-ui/core/Icon";
import { colorTheme } from "../../../constants";

interface IStyles {
  disabled: boolean;
  selected: boolean;
}
const useStyles = makeStyles(() => ({
  checkbox: {
    display: "flex",
    "flex-direction": "row",
    "justify-content": "start",
    "align-items": "center",
    margin: 0,
    padding: "0 5px",
    "border-radius": 5,
    outline: "none",
    flex: 1,
    "min-height": 30,
    color: colorTheme,
    cursor: ({ disabled }: IStyles) => (disabled ? "default" : "pointer"),
  },
  icon: {
    "font-size": "16px !important",
    "margin-right": 5,
    color: ({ selected }: IStyles) => (selected ? colorTheme : "#CBCBCB"),
    opacity: ({ disabled }: IStyles) => (disabled ? 0.3 : 1),
  },
  label: {
    opacity: ({ disabled }: IStyles) => (disabled ? 0.3 : 1),
  },
  labelSub: {
    color: "#bbb",
    "font-size": 10,
    "margin-left": 5,
  },
  flex1: {
    flex: 1,
  },
}));

interface IListCheckbox {
  id: string;
  label: string;
  labelSub?: string;
  disabled?: boolean;
  selected?: boolean;
  onClick: (id: string) => void;
}

const ListCheckbox = ({
  id,
  label,
  labelSub,
  disabled = false,
  selected = false,
  onClick,
}: IListCheckbox) => {
  const classes = useStyles({
    disabled,
    selected,
  });
  const cbOnClick = React.useCallback(() => {
    if (!disabled) onClick(id);
  }, [disabled, id, onClick]);
  return (
    <ButtonBase
      disableRipple={disabled}
      className={classes.checkbox}
      onClick={cbOnClick}
    >
      <Icon
        className={classes.icon}
        children={selected ? "check_box" : "check_box_outline_blank"}
      />
      <Typography
        className={classes.label}
        variant="subtitle1"
        children={label}
      />
      <Typography
        className={classes.labelSub}
        variant="subtitle1"
        children={labelSub}
      />
      <div className={classes.flex1} />
    </ButtonBase>
  );
};

export default ListCheckbox;
