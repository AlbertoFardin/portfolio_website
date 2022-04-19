import * as React from "react";
import * as Colors from "../../componentsBase/style/Colors";
import Btn from "../../componentsBase/Btn";
import MaterialUiSnackbar from "@material-ui/core/Snackbar";
import ISnackbar from "./ISnackbar";
import { ACTION_MAIN } from "../reducer";
import AlertContent from "../Alert/AlertContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Slide from "@material-ui/core/Slide";
import Paper from "@material-ui/core/Paper";
import { Severity } from "../../interfaces";
import { ContextDispatchMain } from "../contexts";

const useStyles = makeStyles({
  paper: {
    overflow: "hidden",
  },
  alert: {
    "min-width": 300,
    "max-width": 500,
  },
});

const Snackbar = ({ open, severity, message }: ISnackbar) => {
  const classes = useStyles({});
  const dispatchMain = React.useContext(ContextDispatchMain);

  const onClose = React.useCallback(() => {
    dispatchMain({ type: ACTION_MAIN.SNACKBAR__RESET });
  }, [dispatchMain]);
  const cbSnackbarReason = React.useCallback(
    (e, reason) => (reason === "timeout" ? onClose() : null),
    [onClose]
  );
  const onRefresh = React.useCallback(() => {
    dispatchMain({
      type: ACTION_MAIN.REFRESH_TIME,
      time: new Date().getTime(),
    });
  }, [dispatchMain]);

  return (
    <Slide in={open} direction="right">
      <MaterialUiSnackbar
        open
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        onClose={cbSnackbarReason}
        autoHideDuration={2500}
      >
        <Paper elevation={3} className={classes.paper}>
          <AlertContent
            className={classes.alert}
            severity={severity}
            message={message}
            action={
              severity === Severity.WARNING ? (
                <Btn color={Colors.Gray1} icon="refresh" onClick={onRefresh} />
              ) : (
                <Btn color={Colors.Gray1} icon="close" onClick={onClose} />
              )
            }
          />
        </Paper>
      </MaterialUiSnackbar>
    </Slide>
  );
};

export default Snackbar;
