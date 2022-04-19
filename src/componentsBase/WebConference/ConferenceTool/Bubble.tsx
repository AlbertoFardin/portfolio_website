import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import MeetingSession from "amazon-chime-sdk-js/build/meetingsession/MeetingSession";
import classnames from "classnames";
import Zoom from "@material-ui/core/Zoom";
import IUser from "../../IUser";
import MeterVolume from "./MeterVolume";
import { ZINDEX_CONFERENCE } from "../../utils/zIndex";

const size = 80;
const useStyles = makeStyles({
  displayNone: {
    display: "none !important",
  },
  bubble: {
    width: size,
    height: size,
    "background-color": "#f1f1f1",
    "background-size": "contain",
    "border-radius": 1000,
    margin: "5px 20px",
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
    "justify-content": "center",
    "text-align": "center",
    position: "relative",
  },
  label: {
    width: size - 10,
    color: "#fff",
    overflow: "hidden",
    "text-overflow": "ellipsis",
  },
  hoverMask: {
    "background-color": "rgba(0,0,0,0.5)",
    width: "inherit",
    height: "inherit",
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
    "justify-content": "center",
    "border-radius": 1000,
    position: "absolute",
    "z-index": ZINDEX_CONFERENCE,
  },
  video: {
    width: size,
    height: size,
    objectFit: "cover",
    "border-radius": 1000,
  },
});

interface IBubble extends IUser {
  meetingSession: MeetingSession;
  videoRef: React.MutableRefObject<HTMLVideoElement>;
  attendeeId: string;
  displayNone?: boolean;
  transitionsIn: boolean;
  transitionsTimeout: number;
  volume: number;
  muted: boolean;
}

const Bubble = ({
  meetingSession,
  videoRef,
  attendeeId,
  firstName,
  lastName,
  picture,
  displayNone = false,
  transitionsIn,
  transitionsTimeout,
  volume,
  muted,
}: IBubble) => {
  const classes = useStyles({});
  const [hover, setHover] = React.useState(false);
  const onMouseEnter = React.useCallback(() => setHover(true), []);
  const onMouseLeave = React.useCallback(() => setHover(false), []);

  return (
    <Zoom
      in={transitionsIn}
      timeout={{
        enter: transitionsTimeout,
        exit: 250,
      }}
    >
      <Paper
        elevation={3}
        className={classnames({
          [classes.bubble]: true,
          [classes.displayNone]: displayNone,
        })}
        style={{ backgroundImage: `url(${picture})` }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <video ref={videoRef} className={classes.video}>
          <track kind="captions" />
        </video>
        <Fade in={hover}>
          <div className={classes.hoverMask}>
            <Typography
              className={classes.label}
              variant="caption"
              children={firstName}
            />
            <Typography
              className={classes.label}
              variant="caption"
              children={lastName}
            />
          </div>
        </Fade>
        <MeterVolume
          muted={muted}
          volume={volume}
          meetingSession={meetingSession}
          attendeeId={attendeeId}
        />
      </Paper>
    </Zoom>
  );
};

export default Bubble;
