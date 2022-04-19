import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Btn from "../../../componentsBase/Btn";
import { emptyFn } from "../../../componentsBase/utils/common";

const useStyles = makeStyles({
  btnCopy: {
    "align-self": "baseline",
    "min-height": 22,
    margin: "6px 0 2px 0",
  },
  btnCopyIcon: {
    "font-size": "12px !important",
    "margin-left": 5,
  },
  btnCopyLabel: {
    "font-weight": 300,
  },
});

interface IBtnProduct {
  icon?: string;
  label: string;
  tooltip: string;
  copyToClipboard: string;
}

const BtnCopy = ({
  icon = "content_copy",
  label,
  tooltip,
  copyToClipboard,
}: IBtnProduct) => {
  const classes = useStyles({});
  return (
    <Btn
      variant="bold"
      icon={icon}
      label={label}
      copyToClipboard={copyToClipboard}
      onClick={emptyFn}
      tooltip={tooltip}
      className={classes.btnCopy}
      iconClassName={classes.btnCopyIcon}
      labelClassName={classes.btnCopyLabel}
    />
  );
};

export default BtnCopy;
