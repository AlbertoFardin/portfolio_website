import * as React from "react";
import IconCheck from "@material-ui/icons/CheckCircleOutlineOutlined";
import IconInfo from "@material-ui/icons/InfoOutlined";
import IconError from "@material-ui/icons/ErrorOutline";
import IconWarning from "@material-ui/icons/ReportProblemOutlined";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Severity } from "../../interfaces";

interface IAlertIcon {
  severity: Severity;
}
const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: 12,
    padding: "7px 0",
    display: "flex",
    fontSize: 22,
    opacity: 0.9,
    color: ({ severity }: IAlertIcon) => {
      if (severity === Severity.SUCCESS) return theme.palette.success.main;
      if (severity === Severity.INFO) return theme.palette.info.main;
      if (severity === Severity.WARNING) return theme.palette.warning.main;
      if (severity === Severity.ERROR) return theme.palette.error.main;
      return "#000";
    },
  },
}));

const ICON_MAP = {
  [Severity.SUCCESS]: <IconCheck />,
  [Severity.WARNING]: <IconWarning />,
  [Severity.ERROR]: <IconError />,
  [Severity.INFO]: <IconInfo />,
};

const AlertIcon = ({ severity }: IAlertIcon) => {
  const classes = useStyles({ severity });
  return <div className={classes.icon} children={ICON_MAP[severity]} />;
};

export default AlertIcon;
