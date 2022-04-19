import * as React from "react";
import Typography from "@material-ui/core/Typography";
import { ViewStatus } from "./reducer";
import mixColors from "../../../componentsBase/utils/mixColors";
import * as Colors from "../../../componentsBase/style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";

interface IStyles {
  color: string;
}
const useStyles = makeStyles({
  statuslabel: {
    "font-weight": "bold",
    padding: "3px 8px",
    "border-radius": 3,
    "margin-right": 10,
    color: ({ color }: IStyles) => color,
    "background-color": ({ color }: IStyles) =>
      mixColors(0.15, "#ffffff", color),
  },
});

const getLabel = (status: ViewStatus): string => {
  switch (status) {
    case ViewStatus.CREATE:
      return "Adding";
    case ViewStatus.REMOVE:
      return "Removing";
    case ViewStatus.MODIFY:
      return "Modifying";
    default:
      return "NONE";
  }
};

export const getColor = (status: ViewStatus): string => {
  switch (status) {
    case ViewStatus.CREATE:
      return Colors.Green;
    case ViewStatus.REMOVE:
      return Colors.Red;
    case ViewStatus.MODIFY:
      return Colors.Purple;
    default:
      return Colors.Gray3;
  }
};

interface IStatusLabel {
  status: ViewStatus;
  count?: number;
}

const StatusLabel = ({ status, count }: IStatusLabel) => {
  const label = getLabel(status);
  const color = getColor(status);
  const classes = useStyles({ color });
  return (
    <Typography
      variant={"body1"}
      className={classes.statuslabel}
      children={
        !count ? label : `${label} ${count} view${count > 1 ? "s" : ""}`
      }
    />
  );
};

export default StatusLabel;
