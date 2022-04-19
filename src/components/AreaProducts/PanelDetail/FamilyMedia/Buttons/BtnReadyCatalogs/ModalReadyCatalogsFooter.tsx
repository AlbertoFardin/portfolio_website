import makeStyles from "@material-ui/core/styles/makeStyles";
import Toolbar from "@material-ui/core/Toolbar";
import Btn from "../../../../../../componentsBase/Btn";
import * as React from "react";

const useStyles = makeStyles({
  toolbar: {
    "min-height": 0,
    height: "initial",
    "align-items": "start",
    "margin-top": 10,
  },
  flex1: {
    flex: 1,
  },
});

interface IModalReadyCatalogsFooter {
  confirmDisabled: boolean;
  confirmLabel: string;
  confirmColor: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ModalReadyCatalogsFooter = ({
  confirmDisabled,
  confirmLabel,
  confirmColor,
  onConfirm,
  onCancel,
}: IModalReadyCatalogsFooter) => {
  const classes = useStyles({});
  return (
    <Toolbar className={classes.toolbar}>
      <div className={classes.flex1} />
      <Btn variant="bold" label="CANCEL" onClick={onCancel} />
      <Btn
        variant="bold"
        color={confirmColor}
        label={confirmLabel}
        disabled={confirmDisabled}
        onClick={onConfirm}
      />
    </Toolbar>
  );
};

export default ModalReadyCatalogsFooter;
