import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import Btn from "../Btn";

const useStyles = makeStyles({
  button: {
    margin: 0,
  },
  disabled: {
    opacity: 0.75,
  },
});

interface IBtnArrow {
  disabled?: boolean;
  icon: string;
  onClick: () => void;
}

const BtnArrow = ({ disabled = false, icon, onClick }: IBtnArrow) => {
  const classes = useStyles({});
  return (
    <Btn
      className={classnames({
        [classes.button]: true,
        [classes.disabled]: disabled,
      })}
      icon={icon}
      disabled={disabled}
      onClick={onClick}
    />
  );
};

export default BtnArrow;
