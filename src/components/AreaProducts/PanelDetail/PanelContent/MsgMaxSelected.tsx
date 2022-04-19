import * as React from "react";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { MAX_PRODUCTS_MASSIVE_ACTIONS } from "../../../../constants";

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

const MsgMaxSelected = () => {
  const classes = useStyles({});
  return (
    <div className={classes.message}>
      <Typography style={{ fontSize: 30 }} variant="subtitle2" children="🤔" />
      <br />
      <Typography
        style={{ textAlign: "center" }}
        variant="subtitle1"
        children={
          <>
            It seems that you have selected too items.
            <br />
            You can bulk edit max {MAX_PRODUCTS_MASSIVE_ACTIONS} items
            simultaneously.
            <br />
            We are working to increase this number!
            <br />
            <b>
              Please select {MAX_PRODUCTS_MASSIVE_ACTIONS} item max. Thank you!
            </b>
          </>
        }
      />
    </div>
  );
};

export default MsgMaxSelected;
