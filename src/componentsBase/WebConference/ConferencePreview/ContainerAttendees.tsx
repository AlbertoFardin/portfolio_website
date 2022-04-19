import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import isEmpty from "lodash-es/isEmpty";
import classnames from "classnames";
import Tooltip from "../../Tooltip";
import IUser from "../../IUser";

const useStyles = makeStyles({
  userContainer: {
    "justify-content": "center",
    display: "flex",
    "margin-bottom": 10,
  },
  avatar: {
    width: 35,
    height: 35,
    margin: "0 -6px 0 0px",
    display: "inline-flex",
    "vertical-align": "middle",
    "background-color": "#ddd",
    border: "3px solid #fff",
  },
  avatarIcon: {
    position: "fixed",
    margin: "auto",
    bottom: 0,
    top: 0,
    right: 0,
    left: 0,
    color: "#fff",
    "font-size": "18px !important",
  },
  avatarMini: {
    width: 25,
    height: 25,
    margin: "0 6px 0 0px",
  },
  userMenuAvatar: {
    color: "#000",
    "font-size": 13,
    "background-color": "transparent",
    "border-color": "transparent",
  },
  userMenuTooltip: {
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    "margin-bottom": 5,
  },
});

interface IContainerAttendees {
  attendees?: IUser[];
}

const ContainerAttendees = ({ attendees = [] }: IContainerAttendees) => {
  const classes = useStyles();
  const maxUser = 6;
  const usersShow = attendees.filter((x, i) => i < maxUser);
  const usersMenu = attendees.filter((x, i) => i >= maxUser);

  return (
    <div className={classes.userContainer}>
      {usersShow.map(({ id, firstName, lastName, picture }: IUser) => (
        <Tooltip
          key={id}
          title={
            <Typography
              style={{ color: "#fff" }}
              variant="body1"
              children={`${firstName} ${lastName}`}
            />
          }
        >
          <Avatar
            src={picture}
            className={classes.avatar}
            children={<Icon className={classes.avatarIcon} children="person" />}
          />
        </Tooltip>
      ))}
      {isEmpty(usersMenu) ? null : (
        <Tooltip
          title={
            <>
              {usersMenu.map(({ id, firstName, lastName, picture }: IUser) => (
                <div key={id} className={classes.userMenuTooltip}>
                  <Avatar
                    src={picture}
                    className={classes.avatarMini}
                    children={
                      <Icon className={classes.avatarIcon} children="person" />
                    }
                  />
                  <div>
                    <Typography
                      style={{ color: "#fff" }}
                      variant="body1"
                      children={`${firstName} ${lastName}`}
                    />
                  </div>
                </div>
              ))}
            </>
          }
        >
          <Avatar
            className={classnames([classes.avatar, classes.userMenuAvatar])}
            children={`+${usersMenu.length}`}
          />
        </Tooltip>
      )}
    </div>
  );
};

export default ContainerAttendees;
