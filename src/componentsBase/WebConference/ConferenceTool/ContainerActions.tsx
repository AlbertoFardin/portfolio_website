import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import BtnMini from "./BtnMini";

const useStyles = makeStyles({
  modeContainer: {
    position: "fixed",
    margin: "auto",
    top: 43,
    right: 0,
    left: 0,
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    "justify-content": "center",
    width: "fit-content",
  },
});

interface IContainerActions {
  attendeeCount: number;
  fullscreen: boolean;
  toggleFullscreen: () => void;
  showBubbles: boolean;
  toggleBubbles: () => void;
  people: boolean;
  togglePeople: () => void;
}

const ContainerActions = ({
  attendeeCount,
  showBubbles,
  toggleBubbles,
  people,
  togglePeople,
}: IContainerActions) => {
  const classes = useStyles({});
  return (
    <div className={classes.modeContainer}>
      <BtnMini
        icon="people_alt"
        label={String(Math.max(1, attendeeCount))}
        onClick={togglePeople}
        selected={people}
        tooltip="Open/Close Attendees List"
      />
      <BtnMini
        icon={showBubbles ? "more_vert" : "remove"}
        onClick={toggleBubbles}
        selected={!showBubbles}
        tooltip="Open/Close Bubbles"
      />
      {/*
      <BtnMini
        icon={fullscreen ? 'fullscreen' : 'fullscreen_exit'}
        onClick={toggleFullscreen}
        selected={fullscreen}
        tooltip="Fullscreen"
      />
      */}
    </div>
  );
};

export default React.memo(ContainerActions);
