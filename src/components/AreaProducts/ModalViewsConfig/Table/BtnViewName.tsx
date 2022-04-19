import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import { ViewStatus } from "../reducer";

const getIcon = (status: ViewStatus) => {
  switch (status) {
    case ViewStatus.NONE:
      return "check_box_outline_blank";
    case ViewStatus.MODIFY:
    case ViewStatus.VALUED:
      return "remove_circle_outline";
    case ViewStatus.CREATE:
      return "check_box";
    case ViewStatus.REMOVE:
      return "remove_circle";
    default:
      return "help";
  }
};
const getColor = (status: ViewStatus) => {
  switch (status) {
    case ViewStatus.CREATE:
      return Colors.Green;
    case ViewStatus.REMOVE:
      return Colors.Red;
    default:
      return Colors.Gray2;
  }
};

interface IStyles {
  color: string;
}
const useStyles = makeStyles({
  button: {
    display: "flex",
    "flex-direction": "row",
    "justify-content": "start",
    "align-items": "center",
    padding: 5,
    "border-radius": 5,
    color: ({ color }: IStyles) => color,
  },
  icon: {
    "font-size": "16px !important",
    "margin-right": 5,
    color: ({ color }: IStyles) => color,
  },
});

interface IBtnViewName {
  label: string;
  status: ViewStatus;
  onClick: () => void;
}

const BtnViewName = ({ label, status, onClick }: IBtnViewName) => {
  const icon = getIcon(status);
  const color = getColor(status);
  const classes = useStyles({ color });
  return (
    <ButtonBase className={classes.button} onClick={onClick}>
      <Icon className={classes.icon} children={icon} />
      <Typography variant="body2" children={label} />
    </ButtonBase>
  );
};

export default BtnViewName;
