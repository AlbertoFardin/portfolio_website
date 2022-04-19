import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  placeholder: {
    "text-align": "center",
    margin: "0 30px",
    flex: 1,
    display: "flex",
    "flex-direction": "column",
  },
});

const WindowJobsPlaceholder = () => {
  const classes = useStyles({});
  return (
    <div className={classes.placeholder}>
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 50 }} children="🔔" />
      <Typography variant="caption" children="you have no notifications" />
      <div style={{ flex: 1, paddingBottom: 20 }} />
    </div>
  );
};

export default WindowJobsPlaceholder;
