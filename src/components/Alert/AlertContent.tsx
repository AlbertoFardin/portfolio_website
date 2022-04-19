import * as React from "react";
import { lighten, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Severity } from "../../interfaces";
import AlertIcon from "./AlertIcon";
import classnames from "classnames";

interface IStyles {
  severity: Severity;
}

const getColorByCoefficient = (theme: Theme, coefficient: number) => ({
  severity,
}: IStyles) => {
  let color = "#000";
  if (severity === Severity.SUCCESS) color = theme.palette.success.main;
  if (severity === Severity.INFO) color = theme.palette.info.main;
  if (severity === Severity.WARNING) color = theme.palette.warning.main;
  if (severity === Severity.ERROR) color = theme.palette.error.main;
  return lighten(color, coefficient);
};

const useStyles = makeStyles((theme) => ({
  alert: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "6px 16px",
    color: getColorByCoefficient(theme, 0.6),
    backgroundColor: getColorByCoefficient(theme, 0.9),
  },
  flex1: {
    flex: 1,
  },
  message: {
    "white-space": "nowrap",
    "text-overflow": "ellipsis",
    overflow: "hidden",
  },
}));

interface IAlertContent {
  className?: string;
  severity: Severity;
  message: string;
  action?: JSX.Element;
}

const AlertContent = ({
  className,
  severity,
  message,
  action,
}: IAlertContent) => {
  const classes = useStyles({ severity });
  return (
    <div className={classnames([classes.alert, className])}>
      <AlertIcon severity={severity} />
      <Typography
        variant="body2"
        className={classes.message}
        children={message}
      />
      <div className={classes.flex1} />
      {action}
    </div>
  );
};

export default AlertContent;
