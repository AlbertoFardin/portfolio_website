import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { v4 as uuidv4 } from "uuid";
import Draggable from "react-draggable";
import classnames from "classnames";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Toolbar from "@material-ui/core/Toolbar";
import Btn from "../../Btn";
import * as Colors from "../../style/Colors";
import BtnDrag from "../ConferenceTool/BtnDrag";
import AttendeesList from "./AttendeesList";
import { IConferenceAttendees } from "./IConferenceAttendees";
import Portal from "@material-ui/core/Portal";
import { ZINDEX_CONFERENCE } from "../../utils/zIndex";

const clsDrag = `confluenceAttendeesDrag_${uuidv4()}`;
const useStyles = makeStyles({
  confluenceAttendees: {
    position: "fixed",
    margin: "auto",
    width: 250,
    height: "fit-content",
    "max-height": 500,
    "background-color": "#fff",
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
    "z-index": ZINDEX_CONFERENCE,
    overflow: "hidden",
  },
  displayNone: {
    display: "none",
  },
  toolbar: {
    padding: 0,
    "justify-content": "space-between",
    "min-height": 0,
    height: "fit-content",
    "background-color": Colors.Gray4,
  },
});

const ConferenceAttendees = ({
  open,
  position = { top: 0, right: 0 },
  onClose,
  attendees,
  meetingSession,
  attendeeIdMapVolume,
}: IConferenceAttendees) => {
  const classes = useStyles();
  // const [tab, setTab] = React.useState('list');
  return (
    <Portal>
      <Draggable handle={`.${clsDrag}`} bounds="parent">
        <Paper
          className={classnames({
            [classes.confluenceAttendees]: true,
            [classes.displayNone]: !open,
          })}
          style={position}
          elevation={2}
        >
          <Toolbar className={classes.toolbar}>
            <BtnDrag className={clsDrag} />
            <Btn icon="close" onClick={onClose} />
          </Toolbar>
          <Divider />
          <AttendeesList
            attendeeIdMapVolume={attendeeIdMapVolume}
            meetingSession={meetingSession}
            attendees={attendees}
          />

          {/*
          <LayoutTab
            panelSelectedId={tab}
            onChange={setTab}
            panels={[{
              id: 'list',
              title: (
                <Tab
                  icon="people_alt"
                  label="Attendees"
                  selected={tab === 'list'}
                />
              ),
              children: (
                <AttendeesList
                  meetingSession={meetingSession}
                  attendees={attendees}
                />
              )
            }, {
              id: 'chat',
              title: (
                <Tab
                  icon="chat"
                  label="Chat"
                  selected={tab === 'chat'}
                />
              ),
              children: (
                <AttendeesChat />
              )
            }]}
          />
          */}
        </Paper>
      </Draggable>
    </Portal>
  );
};

export default ConferenceAttendees;
