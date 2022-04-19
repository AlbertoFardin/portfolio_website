import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import MeterVolume from "../../ConferenceTool/MeterVolume";
import { IAttendeesList } from ".";

const size = 35;
const useStyles = makeStyles({
  attendeesList: {
    position: "relative",
    "min-height": 45,
    width: "inherit",
    "max-height": 305,
    overflow: "overlay",
  },
  attendee: {
    position: "relative",
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    margin: "5px 10px",
  },
  volume: {
    position: "relative",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: "0 7px",
    "box-shadow": "none",
    "background-color": "transparent",
  },
  avatar: {
    position: "relative",
    display: "inline-block",
    "vertical-align": "middle",
    "background-color": "#ddd",
    height: size,
    width: size,
  },
  avatarIcon: {
    position: "fixed",
    margin: "auto",
    bottom: 0,
    top: 0,
    right: 0,
    left: 0,
    color: "#fff",
    "font-size": `${size / 2}px !important`,
  },
  label: {
    flex: 1,
    "white-space": "nowrap",
    overflow: "hidden",
    "text-overflow": "ellipsis",
  },
});

const AttendeesList = ({
  attendees,
  meetingSession,
  attendeeIdMapVolume,
}: IAttendeesList) => {
  const classes = useStyles();
  return (
    <div className={classes.attendeesList}>
      {attendees.map(({ firstName, lastName, picture, attendeeId }) => (
        <div key={attendeeId} className={classes.attendee}>
          <Avatar
            className={classes.avatar}
            src={picture}
            children={<Icon className={classes.avatarIcon} children="person" />}
          />
          <MeterVolume
            volume={attendeeIdMapVolume.get(attendeeId)?.volume}
            muted={attendeeIdMapVolume.get(attendeeId)?.muted}
            className={classes.volume}
            meetingSession={meetingSession}
            attendeeId={attendeeId}
          />
          <Typography
            variant="body1"
            className={classes.label}
            children={`${firstName} ${lastName}`}
          />
        </div>
      ))}
    </div>
  );
};

export default AttendeesList;
