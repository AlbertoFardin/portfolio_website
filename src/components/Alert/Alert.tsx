import * as React from "react";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Severity } from "../../interfaces";
import IAlert from "./IAlert";
import Btn from "../../componentsBase/Btn";
import * as Colors from "../../componentsBase/style/Colors";
import AlertContent from "./AlertContent";

const useStyles = makeStyles({
  layer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: 999999999,
  },
});

const Alert = ({ open, severity, message }: IAlert) => {
  const classes = useStyles({ severity });
  const onRefresh = React.useCallback(() => {
    location.reload();
  }, []);
  return (
    <Collapse in={open}>
      <>
        <AlertContent
          severity={severity}
          message={message}
          action={
            severity !== Severity.WARNING ? null : (
              <Btn
                variant="bold"
                color={Colors.Orange}
                label="REFRESH PAGE"
                onClick={onRefresh}
              />
            )
          }
        />
        <Divider />
        <div className={classes.layer} />
      </>
    </Collapse>
  );
};

export default Alert;
