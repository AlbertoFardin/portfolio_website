import * as React from "react";
import List from "@material-ui/core/List";
import Popover from "@material-ui/core/Popover";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ACT_VPORT } from "../reducer";
import { IMenuViewAssegnees } from "../../../interfaces";
import getUser from "../../../utils/getUser";
import { ContextM2ms, ContextUsers } from "../../contexts";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { ContextDispatchViewport } from "../contexts";

const useStyles = makeStyles({
  menu: {
    display: "flex",
    "flex-direction": "column",
    padding: "0 10px",
  },
  title: {
    margin: "10px 5px",
  },
  list: {
    "max-height": 205,
    "min-width": 205,
    overflow: "overlay",
  },
  listItem: {
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    "padding-top": 8,
  },
  avatar: {
    position: "relative",
    display: "inline-block",
    "vertical-align": "middle",
    "margin-right": 5,
    "background-color": "#ddd",
    height: 24,
    width: 24,
  },
});

const MenuViewAssignees = ({
  open,
  positionTop,
  positionLeft,
  viewAssegnees,
}: IMenuViewAssegnees) => {
  const classes = useStyles({});
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const users = React.useContext(ContextUsers);
  const m2ms = React.useContext(ContextM2ms);

  const onClose = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.MENU_VIEW_ASSIGNEES, reset: true });
  }, [dispatchViewport]);

  return !open ? null : (
    <Popover
      open
      anchorReference="anchorPosition"
      anchorPosition={{
        top: positionTop,
        left: positionLeft,
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      onClose={onClose}
    >
      <div className={classes.menu}>
        <Typography
          className={classes.title}
          variant="subtitle2"
          children={`Assigned to ${viewAssegnees.length} users`}
        />
        <List className={classes.list}>
          {viewAssegnees.map((v) => {
            const { id, name, picture } = getUser(v.assignee, { users, m2ms });
            return (
              <div key={id} className={classes.listItem}>
                <Avatar className={classes.avatar} src={picture} />
                <Typography variant="body1" children={name} />
              </div>
            );
          })}
        </List>
      </div>
    </Popover>
  );
};

export default MenuViewAssignees;
