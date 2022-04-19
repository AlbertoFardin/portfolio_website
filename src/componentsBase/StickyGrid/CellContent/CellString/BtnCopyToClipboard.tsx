import Zoom from "@material-ui/core/Zoom";
import * as React from "react";
import Btn from "../../../Btn";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { emptyFn } from "../../../utils/common";

const useStyles = makeStyles({
  btnCopy: {
    minWidth: 20,
    minHeight: 20,
  },
  btnCopyIcon: {
    fontSize: "12px !important",
  },
});

interface IBtnCopyToClipboard {
  visibled: boolean;
  value: string;
  onClick?: () => void;
}

export const BtnCopyToClipboard = ({
  visibled,
  value,
  onClick = emptyFn,
}: IBtnCopyToClipboard) => {
  const classes = useStyles({});
  return (
    <Zoom in={visibled}>
      <Btn
        className={classes.btnCopy}
        copyToClipboard={value}
        icon="content_copy"
        iconClassName={classes.btnCopyIcon}
        onClick={onClick}
      />
    </Zoom>
  );
};

export default BtnCopyToClipboard;
