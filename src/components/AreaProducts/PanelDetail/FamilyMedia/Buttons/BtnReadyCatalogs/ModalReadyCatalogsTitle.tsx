import makeStyles from "@material-ui/core/styles/makeStyles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { colorTheme } from "../../../../../../constants";

interface IStyles {
  count: number;
}
const useStyles = makeStyles({
  toolbar: {
    "min-height": 0,
    height: "initial",
    "align-items": "start",
    padding: "5px 7px",
    display: "flex",
    "flex-direction": "column",
  },
  label: {
    color: ({ count }: IStyles) => (count ? colorTheme : "#333333"),
  },
});

interface IModalReadyCatalogsTitle {
  label: string;
  count: number;
}

const ModalReadyCatalogsTitle = ({
  label,
  count,
}: IModalReadyCatalogsTitle) => {
  const classes = useStyles({ count });
  return (
    <Toolbar className={classes.toolbar}>
      <Typography variant="body2" className={classes.label} children={label} />
      {!count ? null : (
        <Typography
          variant="body2"
          className={classes.label}
          children={`(${count} catalog${count > 1 ? "s" : ""})`}
        />
      )}
    </Toolbar>
  );
};

export default ModalReadyCatalogsTitle;
