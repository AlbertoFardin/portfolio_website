import * as React from "react";
import Popover from "@material-ui/core/Popover";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import List from "@material-ui/core/List";
import ListItem from "../../componentsBase/ListItem";
import { IUserProfile } from "../../interfaces";

const useStyles = makeStyles(({ palette }) => ({
  menuuser: {
    "min-width": 200,
  },
  flex1: {
    flex: 1,
  },
  listitem: {
    padding: "5px 20px",
  },
  title: {
    color: palette.primary.main,
    padding: "10px 20px 0",
  },
}));

interface IMenuUser {
  anchorEl: Element | ((element: Element) => Element);
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  onUserInfo: () => void;
  userProfile: IUserProfile;
}

const MenuUser = ({
  anchorEl,
  open,
  onClose,
  onLogout,
  onUserInfo,
  userProfile,
}: IMenuUser) => {
  const classes = useStyles({});
  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      PaperProps={{ className: classes.menuuser }}
    >
      <div>
        <Typography
          variant={"subtitle2"}
          className={classes.title}
          children={`${userProfile.firstName} ${userProfile.lastName}`}
        />
        <List>
          <ListItem
            id="profile"
            icon="account_box"
            label="My Profile"
            className={classes.listitem}
            onClick={onUserInfo}
          />
        </List>
        <Divider />
        <List>
          <ListItem
            id="logout"
            emoji="👋"
            label="Logout"
            className={classes.listitem}
            onClick={onLogout}
          />
        </List>
      </div>
    </Popover>
  );
};

export default MenuUser;
