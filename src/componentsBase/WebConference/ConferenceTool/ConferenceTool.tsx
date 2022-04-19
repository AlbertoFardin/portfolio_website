/* eslint-disable no-undef */
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import { v4 as uuidv4 } from "uuid";
import MeetingSession from "amazon-chime-sdk-js/build/meetingsession/MeetingSession";
import classnames from "classnames";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Typography from "@material-ui/core/Typography";
import Btn from "../../Btn";
import * as Colors from "../../style/Colors";
import IUser from "../../IUser";
import IVolume from "../IVolume";
import ConferenceAttendees from "../ConferenceAttendees";
import BtnToggle from "./BtnToggle";
import BtnDrag from "./BtnDrag";
import ContainerBubbles from "./ContainerBubbles";
import ContainerActions from "./ContainerActions";
import Portal from "@material-ui/core/Portal";
import { ZINDEX_CONFERENCE } from "../../utils/zIndex";

const clsDrag = `confluenceToolDrag_${uuidv4()}`;
const useStyles = makeStyles({
  confluenceTool: {
    position: "fixed",
    margin: "auto",
    width: "fit-content",
    height: "fit-content",
    "background-color": Colors.Gray4,
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    "border-radius": 1000,
    "z-index": ZINDEX_CONFERENCE,
  },
  displayNone: {
    display: "none",
  },
  toolButton: {
    "margin-left": "0 !important",
  },
});

interface IConferenceTool {
  open: boolean;
  attendeeIdMapUser?: Map<string, IUser>;
  attendeeIdMapVolume: Map<string, IVolume>;
  conferenceName: string;
  position?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  positionPanelAttendees?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  onClose: () => void;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleFullscreen: () => void;
  enableAudio?: boolean;
  enableVideo?: boolean;
  enableFullscreen?: boolean;
  permissionAudio?: boolean;
  permissionVideo?: boolean;
  meetingSession: MeetingSession;
  videoRef?: React.MutableRefObject<HTMLVideoElement>;
}

const ConferenceTool = ({
  open,
  attendeeIdMapVolume,
  attendeeIdMapUser = new Map(),
  conferenceName,
  position = { top: 0, right: 0 },
  positionPanelAttendees = { top: 0, right: 0 },
  onClose,
  onToggleAudio,
  onToggleVideo,
  onToggleFullscreen,
  enableAudio = false,
  enableVideo = false,
  enableFullscreen = false,
  permissionAudio = true,
  permissionVideo = true,
  meetingSession,
  videoRef,
}: IConferenceTool) => {
  const classes = useStyles({});
  const [showPeople, setShowPeople] = React.useState(false);
  const [showBubbles, setShowBubbles] = React.useState(true);
  const toggleBubbles = React.useCallback(() => setShowBubbles(!showBubbles), [
    showBubbles,
  ]);
  const togglePeople = React.useCallback(() => setShowPeople(!showPeople), [
    showPeople,
  ]);
  const cbOnClose = React.useCallback(() => {
    setShowPeople(false);
    setShowBubbles(true);
    onClose();
  }, [onClose]);
  const attendees = [];
  attendeeIdMapUser.forEach((user, attendeeId) => {
    attendees.push({
      ...user,
      attendeeId,
    });
  });

  return (
    <>
      <Portal>
        <Draggable handle={`.${clsDrag}`} bounds="parent">
          <Paper
            className={classnames({
              [classes.confluenceTool]: true,
              [classes.displayNone]: !open,
            })}
            style={position}
            elevation={2}
          >
            <BtnDrag className={clsDrag} />

            <Btn
              className={classes.toolButton}
              color={Colors.Red}
              icon="call_end"
              tooltip="Leave Web Conference"
              onClick={cbOnClose}
            />
            <BtnToggle
              className={classes.toolButton}
              enabled={enableAudio}
              icon="mic"
              label="microphone"
              onClick={onToggleAudio}
              permission={permissionAudio}
            />
            <BtnToggle
              className={classes.toolButton}
              enabled={enableVideo}
              icon="videocam"
              label="webcam"
              onClick={onToggleVideo}
              permission={permissionVideo}
            />
            <CopyToClipboard text={conferenceName}>
              <Btn
                className={classes.toolButton}
                icon="info"
                tooltip={
                  <>
                    <Typography
                      variant="caption"
                      children="Web Conference code"
                    />
                    <br />
                    <Typography
                      variant="caption"
                      children={`"${conferenceName}"`}
                    />
                    <br />
                    <Typography
                      variant="caption"
                      children="Click to copy the code in your clipboard"
                    />
                  </>
                }
              />
            </CopyToClipboard>
            <ContainerActions
              attendeeCount={attendeeIdMapUser.size}
              showBubbles={showBubbles}
              toggleBubbles={toggleBubbles}
              fullscreen={enableFullscreen}
              toggleFullscreen={onToggleFullscreen}
              people={showPeople}
              togglePeople={togglePeople}
            />
            <ContainerBubbles
              attendeeIdMapVolume={attendeeIdMapVolume}
              videoRef={videoRef}
              meetingSession={meetingSession}
              showBubbles={showBubbles}
              attendeeIdMapUser={attendeeIdMapUser}
            />
          </Paper>
        </Draggable>
      </Portal>
      <ConferenceAttendees
        attendeeIdMapVolume={attendeeIdMapVolume}
        open={showPeople}
        position={positionPanelAttendees}
        onClose={togglePeople}
        attendees={attendees}
        meetingSession={meetingSession}
      />
    </>
  );
};

export default ConferenceTool;
