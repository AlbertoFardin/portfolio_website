import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import Paper from "@material-ui/core/Paper";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import classnames from "classnames";
import Btn from "../../Btn";
import * as Colors from "../../style/Colors";
import Placeholder from "../../Placeholder";
import ContainerAttendees from "./ContainerAttendees";
import ContainerCode from "./ContainerCode";
import BtnToggle from "./BtnToggle";
import { IConferencePreview } from ".";
import {
  ZINDEX_CONFERENCE,
  ZINDEX_CONFERENCE_BACKDROP,
} from "../../utils/zIndex";

const videoHeigth = 200;
const videoWidth = 310;
const padding = 20;
const useStyles = makeStyles({
  displayNone: {
    display: "none",
  },
  dialog: {
    position: "fixed",
    margin: "auto",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "fit-content",
    height: "fit-content",
    "z-index": ZINDEX_CONFERENCE,
  },
  backdrop: {
    "z-index": ZINDEX_CONFERENCE_BACKDROP,
  },
  modalHeader: {
    padding,
    "padding-bottom": 0,
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
  },
  modalContent: {
    padding,
    "padding-top": 5,
    "padding-bottom": 10,
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
  modalFooter: {
    padding,
    "padding-top": 5,
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    "justify-content": "center",
    "min-height": 30,
  },
  errorLabel: {
    color: Colors.Red,
    "text-align": "center",
    margin: 5,
  },
  webcamContainer: {
    overflow: "hidden",
    position: "relative",
    height: videoHeigth,
    width: videoWidth,
    "min-height": videoHeigth,
    "min-width": videoWidth,
    "background-color": "#f1f1f1",
  },
  flex1: {
    flex: 1,
  },
  video: {
    width: videoWidth,
    height: videoHeigth,
    objectFit: "cover",
  },
});

const ConferencePreview = ({
  open,
  conferenceName,
  onEnter,
  onClose,
  onToggleAudio,
  onToggleVideo,
  enableAudio = false,
  enableVideo = false,
  permissionAudio = true,
  permissionVideo = true,
  loading = false,
  videoRef,
  attendees,
}: IConferencePreview) => {
  const classes = useStyles();
  return (
    <>
      <Paper
        elevation={3}
        className={classnames({
          [classes.dialog]: true,
          [classes.displayNone]: !open,
        })}
      >
        <div className={classes.modalHeader}>
          <Typography variant="h3" children="Web Conference is Ready" />
        </div>

        <DialogContent className={classes.modalContent}>
          <ContainerCode code={conferenceName} />
          <ContainerAttendees attendees={attendees} />
          <Paper elevation={0} className={classes.webcamContainer}>
            {enableVideo && permissionVideo ? null : (
              <Placeholder label="webcam disabled" />
            )}
            <video ref={videoRef} className={classes.video}>
              <track kind="captions" />
            </video>
          </Paper>
        </DialogContent>

        <div className={classes.modalFooter}>
          {loading ? (
            <>
              <div style={{ flex: 1 }} />
              <CircularProgress
                style={{ color: Colors.Green, margin: 4 }}
                size={20}
                thickness={5}
              />
              <div style={{ flex: 1 }} />
            </>
          ) : (
            <>
              <BtnToggle
                enabled={enableAudio}
                onToggle={onToggleAudio}
                label="microphone"
                icon="mic"
                permission={permissionAudio}
              />
              <BtnToggle
                enabled={enableVideo}
                onToggle={onToggleVideo}
                label="webcam"
                icon="videocam"
                permission={permissionVideo}
              />
              <div style={{ flex: 1 }} />
              <Btn
                style={{ margin: 0 }}
                color={Colors.Green}
                label="ENTER"
                onClick={onEnter}
                selected
              />
            </>
          )}
        </div>
      </Paper>
      <Backdrop open={open} className={classes.backdrop} onClick={onClose} />
    </>
  );
};

export default ConferencePreview;
