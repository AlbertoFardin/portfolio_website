import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import getUser from "../../../utils/getUser";
import { ContextM2ms, ContextUsers } from "../../contexts";
import * as Colors from "../../../componentsBase/style/Colors";

const useStyles = makeStyles({
  avatarColumn: {
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
  },
  avatar: {
    width: 22,
    height: 22,
  },
  icon: {
    "font-size": "12px !important",
  },
});

interface ICardAvatar {
  icon?: string;
  color?: string;
  userId?: string;
}

const CardAvatar = ({
  icon = "person",
  color = Colors.Gray3,
  userId,
}: ICardAvatar) => {
  const classes = useStyles({});
  const users = React.useContext(ContextUsers);
  const m2ms = React.useContext(ContextM2ms);
  return (
    <div className={classes.avatarColumn}>
      <Avatar
        className={classes.avatar}
        style={{ backgroundColor: color }}
        src={userId ? getUser(userId, { users, m2ms }).picture : undefined}
        children={<Icon className={classes.icon} children={icon} />}
      />
    </div>
  );
};

export default CardAvatar;
