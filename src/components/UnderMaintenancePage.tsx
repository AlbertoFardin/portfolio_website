import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Background from "./Background";
import { colorTheme } from "../constants";

const useStyles = makeStyles({
  root: {
    position: "relative",
    width: "inherit",
    height: "inherit",
    "background-color": "#f1f1f1",
  },
  paper: {
    position: "absolute",
    "z-index": 2,
    margin: "auto",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    height: 350,
    width: 650,
    "flex-direction": "column",
    "align-items": "center",
  },
  text: {
    "font-size": 20,
    "text-align": "center",
  },
  textBold: {
    "line-height": 0,
    "font-size": 26,
    "font-weight": 500,
  },
});

const UnderMaintenancePage = () => {
  const classes = useStyles({});
  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={8}>
        <div style={{ flex: 1 }} />
        <Typography className={classes.text} variant="subtitle1">
          <span children="Hey there! 👋" />
          <br />
          <br />
          <span
            children="🚧 The system is temporarily unavailable 🚧"
            className={classes.textBold}
          />
          <br />
          <span
            children="We are working to make it better!"
            className={classes.textBold}
            style={{ color: colorTheme }}
          />
          <br />
          <br />
          <span children="We apologize for the inconvenience" />
        </Typography>
        <div style={{ flex: 1 }} />
      </Paper>
      <Background />
    </div>
  );
};

export default UnderMaintenancePage;
