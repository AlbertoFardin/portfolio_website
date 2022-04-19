import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import { colorTheme } from "../../constants";
import classnames from "classnames";

interface IStyles {
  checked: boolean;
  error: boolean;
}
const useStyles = makeStyles({
  checkbox: {
    display: "flex",
    "flex-direction": "row",
    "justify-content": "start",
    "align-items": "center",
    padding: 5,
    "border-radius": 5,
    color: colorTheme,
    "font-style": "italic",
    width: "100%",
  },
  icon: {
    "font-size": "16px !important",
    "margin-right": 5,
    color: ({ checked }: IStyles) => (checked ? colorTheme : "#CBCBCB"),
  },
  label: {
    color: ({ checked, error }: IStyles) =>
      error && !checked ? "#f00" : "#333",
  },
});

interface ICheckbox {
  id?: string;
  error?: boolean;
  label: string;
  checked: boolean;
  onChange: (id: string, newChecked: boolean) => void;
  className?: string;
}

const Checkbox = ({
  id = "",
  error = false,
  label,
  checked,
  onChange,
  className,
}: ICheckbox) => {
  const classes = useStyles({ checked, error });
  const cbOnChange = React.useCallback(() => {
    onChange(id, !checked);
  }, [checked, id, onChange]);
  return (
    <ButtonBase
      className={classnames({
        [classes.checkbox]: true,
        [className]: !!className,
      })}
      onClick={cbOnChange}
    >
      <Icon
        className={classes.icon}
        children={checked ? "check_box" : "check_box_outline_blank"}
      />
      <Typography className={classes.label} variant="body1" children={label} />
    </ButtonBase>
  );
};

export default Checkbox;
