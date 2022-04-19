/* eslint-disable no-undef */
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MeetingSession from "amazon-chime-sdk-js/build/meetingsession/MeetingSession";
import IUser from "../../IUser";
import IVolume from "../IVolume";
import Bubble from "./Bubble";

const useStyles = makeStyles({
  bubblesContainer: {
    position: "absolute",
    margin: "auto",
    top: 70,
    right: 0,
    left: 0,
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
  },
});

interface IContainerBubbles {
  attendeeIdMapUser: Map<string, IUser>;
  attendeeIdMapVolume: Map<string, IVolume>;
  showBubbles: boolean;
  meetingSession: MeetingSession;
  videoRef?: React.MutableRefObject<HTMLVideoElement>;
}

export enum ACTION {
  UPDATE_ATTENDEE_ID_LOCAL = "UPDATE_ATTENDEE_ID_LOCAL",
  UPDATE_TILE_ID_VIDEO_TILE_STATE = "UPDATE_TILE_ID_VIDEO_TILE_STATE",
  REMOVE_TILE_ID_VIDEO_TILE_STATE = "REMOVE_TILE_ID_VIDEO_TILE_STATE",
  UPDATE_TILE_ATTENDEES = "UPDATE_TILE_ATTENDEES",
}

interface IReducerState {
  attendeeIdTileIdMap: Map<string, number>;
  tileAttendeeIdL: string;
  tileAttendeeId1: string;
  tileAttendeeId2: string;
  tileAttendeeId3: string;
}

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.UPDATE_TILE_ATTENDEES:
      newState.tileAttendeeId1 = action.tileAttendeeId1;
      newState.tileAttendeeId2 = action.tileAttendeeId2;
      newState.tileAttendeeId3 = action.tileAttendeeId3;
      return newState;
    case ACTION.UPDATE_ATTENDEE_ID_LOCAL:
      newState.tileAttendeeIdL = action.id;
      return newState;
    case ACTION.UPDATE_TILE_ID_VIDEO_TILE_STATE:
      {
        if (!state.attendeeIdTileIdMap.has(action.boundAttendeeId)) {
          const newattendeeIdTileIdMap = new Map(state.attendeeIdTileIdMap);
          newattendeeIdTileIdMap.set(action.boundAttendeeId, action.tileId);
          newState.attendeeIdTileIdMap = newattendeeIdTileIdMap;
        }
      }
      return newState;
    case ACTION.REMOVE_TILE_ID_VIDEO_TILE_STATE:
      {
        const newattendeeIdTileIdMap = new Map(state.attendeeIdTileIdMap);
        for (const key of Array.from(newattendeeIdTileIdMap.keys())) {
          if (newattendeeIdTileIdMap.get(key) === action.tileId) {
            newattendeeIdTileIdMap.delete(key);
          }
        }
        newState.attendeeIdTileIdMap = newattendeeIdTileIdMap;
      }
      return newState;
    default:
      console.error(`no action ${action.type}`);
      return state;
  }
};

export const reducerInitState = {
  attendeeIdTileIdMap: new Map(),
  tileAttendeeIdL: "",
  tileAttendeeId1: "",
  tileAttendeeId2: "",
  tileAttendeeId3: "",
};

const ContainerBubbles = ({
  attendeeIdMapUser,
  showBubbles,
  meetingSession,
  videoRef: videoRefLocal,
  attendeeIdMapVolume,
}: IContainerBubbles) => {
  const classes = useStyles({});
  const videoRef1 = React.useRef(null);
  const videoRef2 = React.useRef(null);
  const videoRef3 = React.useRef(null);

  const [state, dispatch] = React.useReducer(reducer, reducerInitState);

  const {
    attendeeIdTileIdMap,
    tileAttendeeIdL,
    tileAttendeeId1,
    tileAttendeeId2,
    tileAttendeeId3,
  } = state;

  const videoTileDidUpdate = React.useCallback((videoTileState) => {
    const { tileId, localTile, isContent, boundAttendeeId } = videoTileState;
    // ignore a tile without attendee ID (attendee disabled video)
    if (!boundAttendeeId) return null;
    // ignore content share
    if (isContent) return null;
    // ignore local tile (your video)
    if (localTile) return null;

    dispatch({
      type: ACTION.UPDATE_TILE_ID_VIDEO_TILE_STATE,
      tileId,
      boundAttendeeId,
    });
    return null;
  }, []);
  const videoTileWasRemoved = React.useCallback((tileId: number) => {
    dispatch({
      type: ACTION.REMOVE_TILE_ID_VIDEO_TILE_STATE,
      tileId,
    });
  }, []);

  React.useEffect(() => {
    const observerObj = {
      videoTileDidUpdate,
      videoTileWasRemoved,
    };
    if (meetingSession && meetingSession.audioVideo) {
      meetingSession.audioVideo.addObserver(observerObj);
    }
  }, [meetingSession, videoTileDidUpdate, videoTileWasRemoved]);

  React.useEffect(() => {
    if (meetingSession && meetingSession.configuration) {
      dispatch({
        type: ACTION.UPDATE_ATTENDEE_ID_LOCAL,
        id: meetingSession.configuration.credentials.attendeeId,
      });
    }
  }, [meetingSession, videoRefLocal]);

  React.useEffect(() => {
    const attendeeIdsFiltered = Array.from(attendeeIdMapUser.keys()).filter(
      (aId) => meetingSession.configuration.credentials.attendeeId !== aId
    );
    switch (attendeeIdsFiltered.length) {
      case 0:
        dispatch({
          type: ACTION.UPDATE_TILE_ATTENDEES,
          tileAttendeeId1: "",
          tileAttendeeId2: "",
          tileAttendeeId3: "",
        });
        break;
      case 1:
        {
          const [tileAttendeeId1] = [...attendeeIdsFiltered];
          meetingSession.audioVideo.bindVideoElement(
            attendeeIdTileIdMap.get(tileAttendeeId1),
            videoRef1.current
          );
          dispatch({
            type: ACTION.UPDATE_TILE_ATTENDEES,
            tileAttendeeId1,
            tileAttendeeId2: "",
            tileAttendeeId3: "",
          });
        }
        break;
      case 2:
        {
          const [tileAttendeeId1, tileAttendeeId2] = [...attendeeIdsFiltered];
          meetingSession.audioVideo.bindVideoElement(
            attendeeIdTileIdMap.get(tileAttendeeId1),
            videoRef1.current
          );
          meetingSession.audioVideo.bindVideoElement(
            attendeeIdTileIdMap.get(tileAttendeeId2),
            videoRef2.current
          );
          dispatch({
            type: ACTION.UPDATE_TILE_ATTENDEES,
            tileAttendeeId1,
            tileAttendeeId2,
            tileAttendeeId3: "",
          });
        }
        break;
      case 3:
        {
          const [tileAttendeeId1, tileAttendeeId2, tileAttendeeId3] = [
            ...attendeeIdsFiltered,
          ];
          meetingSession.audioVideo.bindVideoElement(
            attendeeIdTileIdMap.get(tileAttendeeId1),
            videoRef1.current
          );
          meetingSession.audioVideo.bindVideoElement(
            attendeeIdTileIdMap.get(tileAttendeeId2),
            videoRef2.current
          );
          meetingSession.audioVideo.bindVideoElement(
            attendeeIdTileIdMap.get(tileAttendeeId3),
            videoRef3.current
          );
          dispatch({
            type: ACTION.UPDATE_TILE_ATTENDEES,
            tileAttendeeId1,
            tileAttendeeId2,
            tileAttendeeId3,
          });
        }
        break;
    }
    return () => {
      Array.from(attendeeIdTileIdMap.values()).forEach((v) => {
        meetingSession.audioVideo.unbindVideoElement(v);
      });
    };
  }, [attendeeIdMapUser, meetingSession, attendeeIdTileIdMap]);

  return (
    <div className={classes.bubblesContainer}>
      <Bubble
        {...attendeeIdMapUser.get(tileAttendeeIdL)}
        muted={attendeeIdMapVolume.get(tileAttendeeIdL)?.muted}
        volume={attendeeIdMapVolume.get(tileAttendeeIdL)?.volume}
        meetingSession={meetingSession}
        videoRef={videoRefLocal}
        attendeeId={tileAttendeeIdL}
        displayNone={!tileAttendeeIdL}
        transitionsIn={showBubbles}
        transitionsTimeout={250}
      />
      <Bubble
        {...attendeeIdMapUser.get(tileAttendeeId1)}
        muted={attendeeIdMapVolume.get(tileAttendeeId1)?.muted}
        volume={attendeeIdMapVolume.get(tileAttendeeId1)?.volume}
        meetingSession={meetingSession}
        videoRef={videoRef1}
        attendeeId={tileAttendeeId1}
        displayNone={!tileAttendeeId1}
        transitionsIn={showBubbles}
        transitionsTimeout={500}
      />
      <Bubble
        {...attendeeIdMapUser.get(tileAttendeeId2)}
        muted={attendeeIdMapVolume.get(tileAttendeeId2)?.muted}
        volume={attendeeIdMapVolume.get(tileAttendeeId2)?.volume}
        meetingSession={meetingSession}
        videoRef={videoRef2}
        attendeeId={tileAttendeeId2}
        displayNone={!tileAttendeeId2}
        transitionsIn={showBubbles}
        transitionsTimeout={750}
      />
      <Bubble
        {...attendeeIdMapUser.get(tileAttendeeId3)}
        muted={attendeeIdMapVolume.get(tileAttendeeId3)?.muted}
        volume={attendeeIdMapVolume.get(tileAttendeeId3)?.volume}
        meetingSession={meetingSession}
        videoRef={videoRef3}
        attendeeId={tileAttendeeId3}
        displayNone={!tileAttendeeId3}
        transitionsIn={showBubbles}
        transitionsTimeout={1000}
      />
    </div>
  );
};

export default ContainerBubbles;
