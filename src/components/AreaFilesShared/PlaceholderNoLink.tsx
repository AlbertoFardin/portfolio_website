import Paper from "@material-ui/core/Paper";
import Background from "../Background";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { APP_COLORS } from "../../constants";
import * as React from "react";

const useStyles = makeStyles({
  paper: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    "z-index": 2,
    margin: "auto",
    width: 400,
    height: 350,
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
  },
  emoji: {
    "font-size": 40,
  },
  message: {
    "font-size": 15,
  },
  logo: {
    "font-size": 40,
    "letter-spacing": 0,
    color: APP_COLORS.color,
  },
  flex1: {
    flex: 1,
  },
});

const PlaceholderNoLink = () => {
  const classes = useStyles({});
  return (
    <Background>
      <Paper className={classes.paper}>
        <div className={classes.flex1} />
        <div className={classes.emoji} children="🤔" />
        <div className={classes.flex1} />
        <Typography className={classes.message} children={"We're sorry"} />
        <Typography
          className={classes.message}
          children={"it seems you can't access this page"}
        />
        <div className={classes.flex1} />
        <Typography className={classes.logo} children="SeeCommerce" />
        <div className={classes.flex1} />
      </Paper>
    </Background>
  );
};

export default PlaceholderNoLink;
