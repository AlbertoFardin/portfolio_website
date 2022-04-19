import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import List from "@material-ui/core/List";
import { ACTION } from "./reducer";
import Popover from "@material-ui/core/Popover";
import WindowJobsPlaceholder from "./WindowJobsPlaceholder";
import WindowJobsListItem from "./WindowJobsListItem";
import WindowJobsToolbar from "./WindowJobsToolbar";
import { IRequest } from "../../interfaces";

const useStyles = makeStyles({
  windowJobs: {
    width: 410,
    "max-height": 380,
    "min-height": 168,
    display: "flex",
    "flex-direction": "column",
    overflow: "hidden",
  },
  list: {
    overflow: "auto",
    flex: 1,
  },
});

interface IWindowJobs {
  dispatch: React.Dispatch<unknown>;
  open: boolean;
  anchorEl: Element | ((element: Element) => Element);
  items: IRequest[];
}

const WindowJobs = ({ dispatch, open, anchorEl, items }: IWindowJobs) => {
  const classes = useStyles({});
  const onClose = React.useCallback(() => {
    dispatch({ type: ACTION.WINDOW_OPEN, value: false });
  }, [dispatch]);

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <div className={classes.windowJobs}>
        <WindowJobsToolbar dispatch={dispatch} />
        <List className={classes.list}>
          {!items.length ? (
            <WindowJobsPlaceholder />
          ) : (
            items.map((j) => (
              <WindowJobsListItem key={j.jobId} dispatch={dispatch} {...j} />
            ))
          )}
        </List>
      </div>
    </Popover>
  );
};

export default WindowJobs;
