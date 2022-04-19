import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Popover from "@material-ui/core/Popover";
import * as React from "react";
import classnames from "classnames";
import isEmpty from "lodash-es/isEmpty";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { emptyFn } from "../utils/common";
import ActionsMenuItem from "./ActionsMenuItem";
import IActionsMenu from "./IActionsMenu";
import IAction from "./IAction";
import TypographyEllipsis from "../TypographyEllipsis";

const useStyles = makeStyles({
  paper: {
    "user-select": "none",
    outline: "none",
    overflow: "hidden",
  },
  divider: {
    margin: "0 10px",
  },
  title: {
    padding: "5px 15px",
  },
});

const ActionsMenu = ({
  PaperProps = {},
  actions = [],
  anchorEl,
  anchorOrigin = {
    vertical: "bottom",
    horizontal: "center",
  },
  anchorPosition = {
    top: 0,
    left: 0,
  },
  className,
  disableAutoFocus = false,
  disableEnforceFocus = false,
  hideBackdrop = false,
  onClose = emptyFn,
  open = false,
  style,
  transformOrigin = {
    vertical: "top",
    horizontal: "center",
  },
  title = "",
}: IActionsMenu) => {
  const classes = useStyles({});
  const cbOnClose = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onClose(event);
    },
    [onClose]
  );
  return (
    <Popover
      open={open && !isEmpty(actions)}
      anchorEl={anchorEl ? anchorEl : undefined}
      anchorPosition={!anchorEl ? anchorPosition : undefined}
      anchorReference={!anchorEl ? "anchorPosition" : "anchorEl"}
      onClose={cbOnClose}
      style={style}
      className={className}
      PaperProps={{
        ...PaperProps,
        className: classnames([classes.paper, PaperProps.className]),
        elevation: 2,
        style: {
          position: "absolute",
          zIndex: 1,
          ...PaperProps.style,
        },
      }}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      BackdropProps={{
        invisible: true,
        onClick: cbOnClose,
        onContextMenu: (event: React.MouseEvent<HTMLDivElement>) => {
          // fix double ActionsMenu open
          event.preventDefault();
          event.stopPropagation();
        },
      }}
      disableAutoFocus={disableAutoFocus}
      disableEnforceFocus={disableEnforceFocus}
      hideBackdrop={hideBackdrop}
    >
      <List>
        {!title ? null : (
          <TypographyEllipsis
            key="title"
            className={classes.title}
            variant="body2"
            children={title}
          />
        )}
        {actions.reduce((acc, cur: IAction) => {
          if (cur.divider) {
            acc.push(
              <Divider key={`${cur.id}_divider`} className={classes.divider} />
            );
          }

          if (!cur.hidden) {
            acc.push(
              <ActionsMenuItem key={cur.id} {...cur} onClose={cbOnClose} />
            );
          }
          return acc;
        }, [])}
      </List>
    </Popover>
  );
};

export default ActionsMenu;
