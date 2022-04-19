import Zoom from "@material-ui/core/Zoom";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { emptyFn } from "../../utils/common";

const useStyles = makeStyles(({ palette }) => ({
  btnClear: {
    "border-radius": 100,
    color: palette.primary.main,
    padding: "1px 1px 1px 5px",
  },
  label: {
    color: "#333333",
    "margin-right": 5,
  },
  badge: {
    "min-width": 15,
    height: 15,
    "background-color": "#ffffff",
    "border-radius": 100,
    border: "1px solid #D9D9D9",
    color: palette.primary.main,
    padding: "0 3px",
    "box-sizing": "border-box",
    "justify-content": "center",
    "align-items": "center",
    display: "flex",
  },
}));
interface IBtnClear {
  label: string;
  count: number;
  open?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

const BtnClear = ({
  label,
  count,
  open = false,
  onClick = emptyFn,
}: IBtnClear) => {
  const classes = useStyles({});
  return (
    <Zoom in={open} mountOnEnter unmountOnExit>
      <ButtonBase className={classes.btnClear} onClick={onClick}>
        <Typography
          className={classes.label}
          variant="caption"
          children={label.toLocaleUpperCase()}
        />
        <div className={classes.badge}>
          <Typography variant="caption" children={String(count)} />
        </div>
      </ButtonBase>
    </Zoom>
  );
};

export default BtnClear;
