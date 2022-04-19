import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Icon from "@material-ui/core/Icon";
import MeetingSession from "amazon-chime-sdk-js/build/meetingsession/MeetingSession";
import classnames from "classnames";
import Paper from "@material-ui/core/Paper";
import * as Colors from "../../style/Colors";
import { ZINDEX_CONFERENCE } from "../../utils/zIndex";

interface IStyle {
  volume: number;
}
const meterHeight = 12;
const meterWidth = 2;
const useStyles = makeStyles({
  metervolume: {
    position: "absolute",
    "z-index": ZINDEX_CONFERENCE,
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    display: "flex",
    "align-items": "center",
    "border-radius": 100,
    "justify-content": "center",
  },
  muted: {
    "background-color": `${Colors.Red} !important`,
    color: "#fff",
  },
  unmuted: {
    "background-color": "#f1f1f1",
  },
  meter: {
    "background-color": Colors.Green,
    width: meterWidth,
    "min-height": meterWidth,
    "max-height": meterHeight,
    "border-radius": 1000,
    margin: "0 1px",
    height: ({ volume }: IStyle) => (meterHeight * volume) / 160,
    transition: "height 400ms",
  },
  meterCenter: {
    height: ({ volume }: IStyle) => (meterHeight * volume) / 100,
    transition: "height 250ms",
  },
});

interface IMeterVolume {
  meetingSession: MeetingSession;
  attendeeId: string;
  className?: string;
  volume: number;
  muted: boolean;
}

const MeterVolume = ({
  className,
  volume = 0,
  muted = false,
}: IMeterVolume) => {
  const classes = useStyles({ volume });
  return (
    <Paper
      elevation={3}
      className={classnames({
        [classes.metervolume]: true,
        [className]: !!className,
        [classes.muted]: muted,
        [classes.unmuted]: !muted,
      })}
    >
      {muted ? (
        <>
          <Icon style={{ fontSize: 12 }} children="mic_off" />
        </>
      ) : (
        <>
          <div className={classes.meter} />
          <div className={classnames([classes.meter, classes.meterCenter])} />
          <div className={classes.meter} />
        </>
      )}
    </Paper>
  );
};

export default React.memo(MeterVolume);
