import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Toolbar from "@material-ui/core/Toolbar";
import Btn from "../../../componentsBase/Btn";
import Modal from "../../Modal";
import * as Colors from "../../../componentsBase/style/Colors";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  flex1: {
    flex: 1,
  },
  toolbar: {
    "background-color": Colors.Gray4,
  },
});

interface ISheetFooter {
  onDelete: () => void;
}

const SheetFooter = ({ onDelete }: ISheetFooter) => {
  const classes = useStyles({});
  const [confirm, setConfirm] = React.useState(false);
  const onConfirmOpen = React.useCallback(() => setConfirm(true), []);
  const onConfirmClose = React.useCallback(() => setConfirm(false), []);
  const onDeleteClick = React.useCallback(() => {
    onDelete();
    setConfirm(false);
  }, [onDelete]);

  return (
    <>
      <Divider />
      <Toolbar className={classes.toolbar}>
        <div className={classes.flex1} />
        <Btn
          variant={"bold"}
          color={Colors.Red}
          label="DELETE"
          onClick={onConfirmOpen}
        />
        <div className={classes.flex1} />
      </Toolbar>
      <Modal
        open={confirm}
        onClose={onConfirmClose}
        title="Delete"
        content={
          <Typography
            variant="body1"
            children="Are you sure to delete this attribute?"
          />
        }
        actions={
          <>
            <div style={{ flex: 1 }} />
            <Btn variant="bold" label="CANCEL" onClick={onConfirmClose} />
            <Btn
              variant="bold"
              color={Colors.Red}
              label="DELETE"
              onClick={onDeleteClick}
            />
          </>
        }
      />
    </>
  );
};

export default SheetFooter;
