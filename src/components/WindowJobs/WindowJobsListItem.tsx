import * as React from "react";
import * as Colors from "../../componentsBase/style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { IRequest, RequestStatus, RequestType } from "../../interfaces";
import { ContextM2ms, ContextUsers } from "../contexts";
import getUser from "../../utils/getUser";
import Icon from "@material-ui/core/Icon";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Tooltip from "../../componentsBase/Tooltip";
import TypographyEllipsis from "../../componentsBase/TypographyEllipsis";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import CircularProgress from "@material-ui/core/CircularProgress";
import BtnDelete from "./BtnDelete";

TimeAgo.addDefaultLocale(en);

const getColor = (completed: boolean, hasErrors: boolean): string => {
  if (hasErrors) return Colors.Orange;
  if (completed) return Colors.Green;
  return Colors.Purple;
};
const getIcon = (completed: boolean, hasErrors: boolean) => {
  if (hasErrors) {
    return (
      <Tooltip title="Was there any problem">
        <Icon
          style={{ color: Colors.Orange, fontSize: 20 }}
          children="sync_problem"
        />
      </Tooltip>
    );
  }
  if (completed) {
    return (
      <Tooltip title="Edit request complete successfully">
        <Icon
          style={{ color: Colors.Green, fontSize: 20 }}
          children="check_circle"
        />
      </Tooltip>
    );
  }

  return (
    <Tooltip title="Edit request in progress">
      <CircularProgress size={20} />
    </Tooltip>
  );
};

const mapLabel = {
  [RequestType.ATTRIBUTE_EDITING]: "Edit attribute",
  [RequestType.READY]: "Ready",
  [RequestType.READY_MEDIA]: "Ready view",
  [RequestType.READY_ATTRIBUTE]: "Ready attribute",
  [RequestType.ASSIGNMENT]: "Assign view",
  [RequestType.VIEW_EDITING]: "View editing",
  [RequestType.VIEW_RESET]: "View reset",
  [RequestType.PUBLISHED]: "Published",
};

const useStyles = makeStyles({
  listitem: {
    position: "relative",
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    padding: "2px 21px 2px 15px",
    "background-color": "#fff",
    "&:hover": {
      "background-color": Colors.Gray4,
    },
  },
  avatar: {
    position: "relative",
    display: "inline-block",
    "vertical-align": "middle",
    margin: "0 10px",
    "background-color": "#ddd",
    height: 30,
    width: 30,
  },
});

interface IWindowJobsListItem extends IRequest {
  dispatch: React.Dispatch<unknown>;
}

const WindowJobsListItem = ({
  jobId,
  from,
  completed,
  creation,
  payload,
  dispatch,
}: IWindowJobsListItem) => {
  const classes = useStyles({});
  const [mousehover, setMousehover] = React.useState(false);

  const users = React.useContext(ContextUsers);
  const m2ms = React.useContext(ContextM2ms);
  const user = getUser(from, { users, m2ms });

  const { name, picture } = user;
  const { progress, requestType } = payload;

  const countTotal = progress.length;
  const countError = progress
    .map((a) => a[1])
    .filter((a) => a === RequestStatus.error).length;
  const countDone = progress
    .map((a) => a[1])
    .filter((a) => a === RequestStatus.done).length;

  const color = getColor(!!completed, !!countError);
  const timeAgo = new TimeAgo("en-US");

  const onMouseEnter = React.useCallback(() => {
    setMousehover(true);
  }, []);
  const onMouseLeave = React.useCallback(() => {
    setMousehover(false);
  }, []);

  return (
    <div
      className={classes.listitem}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {getIcon(!!completed, !!countError)}
      <Tooltip title={name}>
        <Avatar className={classes.avatar} src={picture} />
      </Tooltip>
      <TypographyEllipsis
        style={{ flex: 1 }}
        variant="body1"
        children={mapLabel[requestType] || requestType}
      />
      <Typography
        style={{ flex: 1, margin: "0 10px" }}
        variant="body1"
        children={timeAgo.format(new Date(creation).getTime())}
      />
      <Typography
        style={{ width: 60, color, textAlign: "right" }}
        variant="body1"
        children={`${countDone}/${countTotal}`}
      />
      <BtnDelete dispatch={dispatch} id={jobId} visibled={mousehover} />
    </div>
  );
};

export default WindowJobsListItem;
