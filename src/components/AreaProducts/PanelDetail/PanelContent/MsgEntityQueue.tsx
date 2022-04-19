import * as React from "react";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  message: {
    flex: 1,
    "align-items": "center",
    "justify-content": "center",
    display: "flex",
    "flex-direction": "column",
    padding: "0 50px",
  },
});

const MsgEntityQueue = () => {
  const classes = useStyles({});
  return (
    <div className={classes.message}>
      <Typography style={{ fontSize: 30 }} variant="subtitle2" children="👍" />
      <br />
      <Typography
        style={{ textAlign: "center" }}
        variant="subtitle1"
        children={
          <>
            Editing request has been received
            <br />
            and it will be applied soon.
            <br />
            You can close this window
            <br />
            and <b>keep working!</b>
          </>
        }
      />
    </div>
  );
};

export default MsgEntityQueue;
