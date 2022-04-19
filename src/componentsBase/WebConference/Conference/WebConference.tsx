import * as React from "react";
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
  MeetingSession,
  DefaultModality,
} from "amazon-chime-sdk-js";
import Btn from "../../Btn";
import ConferenceStart from "../ConferenceStart";
import ConferencePreview from "../ConferencePreview";
import ConferenceTool from "../ConferenceTool";
import { emptyFn } from "../../utils/common";
import reducer, { ACTION, reducerInitState, ERROR_DEVICE } from "./reducer";
import { IConference } from ".";

/**
 * **Note**: In order for the Web Conference functionality to work properly,
 * the session cookie obtained after successfully authenticating must be stored in the browser.
 *
 */
const Conference = ({
  open,
  onClose,
  onSessionDidStart = emptyFn,
  onSessionDidStop = emptyFn,
  baseUrl,
  positionTool = { top: 50, right: 50 },
  positionPanelAttendees = { top: 50, right: 220 },
  getUser,
  simulcast = true,
  productId = "",
  onAuthorizationFailed = () => null,
  fetchJwt,
}: IConference) => {
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const {
    dialogStart,
    dialogPreview,
    dialogErrorToCreate,
    dialogErrorToJoin,
    conferenceNameToCreate,
    conferenceNameToJoin,
    permissionVideo,
    permissionAudio,
    enableAudio,
    enableVideo,
    enableFullscreen,
    conferenceName,
    meetingOn,
    meetingStarting,
    meetingLeaving,
    attendeeIdMapUser,
    attendeeIdMapVolume,
  } = state;

  const videoRefPreview = React.useRef(null);
  const videoRefLocalTile = React.useRef(null);
  const audioRef = React.useRef(null);
  const meetingSession = React.useRef<MeetingSession>(null);

  const cbResetJoinError = React.useCallback(
    () => dispatch({ type: ACTION.ERROR_JOIN }),
    []
  );
  const cbResetCreateError = React.useCallback(
    () => dispatch({ type: ACTION.ERROR_CREATE }),
    []
  );
  const cbJoin = React.useCallback(
    (id: string) => dispatch({ type: ACTION.JOIN_ID, id }),
    []
  );
  const cbCreate = React.useCallback(
    (id: string) => dispatch({ type: ACTION.CREATE_ID, id }),
    []
  );
  const cbEnter = React.useCallback(
    () => dispatch({ type: ACTION.MEETING_STARTING }),
    []
  );
  const toggleAudio = React.useCallback(() => {
    if (enableAudio) {
      meetingSession.current.audioVideo.realtimeMuteLocalAudio();
    } else {
      meetingSession.current.audioVideo.realtimeUnmuteLocalAudio();
    }
    dispatch({ type: ACTION.TOGGLE_AUDIO });
  }, [enableAudio]);
  const toggleVideoLocalTile = React.useCallback(async () => {
    const { audioVideo } = meetingSession.current;
    if (enableVideo) {
      audioVideo.stopLocalVideoTile();
      audioVideo.stopVideoPreviewForVideoInput(videoRefPreview.current);
      audioVideo.stopVideoPreviewForVideoInput(videoRefLocalTile.current);
    } else {
      const videoInputDevices = await audioVideo.listVideoInputDevices();
      await audioVideo.chooseVideoInputDevice(videoInputDevices[0].deviceId);
      audioVideo.startLocalVideoTile();
      audioVideo.startVideoPreviewForVideoInput(videoRefPreview.current);
      audioVideo.startVideoPreviewForVideoInput(videoRefLocalTile.current);
    }
    dispatch({ type: ACTION.TOGGLE_VIDEO });
  }, [enableVideo]);
  const toggleVideoPreview = React.useCallback(async () => {
    if (enableVideo) {
      meetingSession.current.audioVideo.stopVideoPreviewForVideoInput(
        videoRefPreview.current
      );
    } else {
      const videoInputDevices = await meetingSession.current.audioVideo.listVideoInputDevices();
      await meetingSession.current.audioVideo.chooseVideoInputDevice(
        videoInputDevices[0].deviceId
      );
      meetingSession.current.audioVideo.startVideoPreviewForVideoInput(
        videoRefPreview.current
      );
    }
    dispatch({ type: ACTION.TOGGLE_VIDEO });
  }, [enableVideo]);
  const toggleFullscreen = React.useCallback(
    () => dispatch({ type: ACTION.TOGGLE_FULLSCREEN }),
    []
  );
  const cbClose = React.useCallback(() => {
    onClose();
    dispatch({ type: ACTION.RESET });
  }, [onClose]);
  const audioVideoDidStop = React.useCallback(() => {
    onSessionDidStop();
    onClose();
    dispatch({ type: ACTION.RESET });
  }, [onClose, onSessionDidStop]);
  const audioVideoDidStart = React.useCallback(() => {
    onSessionDidStart();
    dispatch({ type: ACTION.MEETING_ON });
  }, [onSessionDidStart]);
  const cbSessionLeaving = React.useCallback(() => {
    dispatch({ type: ACTION.MEETING_LEAVING });
  }, []);
  const getUserInfo = React.useCallback(
    (extUserId: string) => {
      if (!extUserId) return null;
      const [authId] = extUserId.split("#");
      return getUser(authId);
    },
    [getUser]
  );
  const cbRealtimeSubscribeToAttendeeIdPresence = React.useCallback(
    async (
      presentAttendeeId: string,
      present: boolean,
      externalUserId: string
    ) => {
      if (!present) {
        dispatch({
          type: ACTION.ATTENDEE_REMOVE,
          attendeeId: presentAttendeeId,
        });
      } else {
        meetingSession.current.audioVideo.realtimeSubscribeToVolumeIndicator(
          presentAttendeeId,
          (attendeeId, volume, muted, signalStrength) => {
            const baseAttendeeId = new DefaultModality(attendeeId).base();
            if (baseAttendeeId !== attendeeId) {
              // Optional: Do not include the content attendee (attendee-id#content) in the roster.
              // See the "Screen and content share" section for details.
              return;
            }
            dispatch({
              type: ACTION.UPDATE_ROSTER_ATTENDEE_ID,
              attendeeId,
              volume,
              muted,
              signalStrength,
            });
          }
        );
        dispatch({
          type: ACTION.ATTENDEE_ADD,
          attendeeId: presentAttendeeId,
          user: getUserInfo(externalUserId),
        });
      }
    },
    [getUserInfo]
  );
  const audioInputsChanged = React.useCallback(async () => {
    try {
      const audioInputDevices = await meetingSession.current.audioVideo.listAudioInputDevices();
      await meetingSession.current.audioVideo.chooseAudioInputDevice(
        audioInputDevices[0].deviceId
      );
    } catch {
      console.log("ERROR -> no device audio input");
      dispatch({
        type: ACTION.ERROR_NO_DEVICE,
        error: ERROR_DEVICE.AUDIO_INPUT,
      });
    }
  }, []);
  const audioOutputsChanged = React.useCallback(async () => {
    try {
      const audioOutputDevices = await meetingSession.current.audioVideo.listAudioOutputDevices();
      await meetingSession.current.audioVideo.chooseAudioOutputDevice(
        audioOutputDevices[0].deviceId
      );
    } catch {
      console.log("ERROR -> no device audio output");
      dispatch({
        type: ACTION.ERROR_NO_DEVICE,
        error: ERROR_DEVICE.AUDIO_OUTPUT,
      });
    }
  }, []);
  const videoInputsChanged = React.useCallback(async () => {
    try {
      const videoInputDevices = await meetingSession.current.audioVideo.listVideoInputDevices();
      await meetingSession.current.audioVideo.chooseVideoInputDevice(
        videoInputDevices[0].deviceId
      );
    } catch {
      console.log("ERROR -> no device video");
      dispatch({ type: ACTION.ERROR_NO_DEVICE, error: ERROR_DEVICE.VIDEO });
    }
  }, []);

  // on "meetingLeaving", stop meetingSession and stop videos
  React.useEffect(() => {
    if (meetingLeaving) {
      meetingSession.current.audioVideo.chooseAudioInputDevice(null);
      meetingSession.current.audioVideo.chooseAudioOutputDevice(null);
      meetingSession.current.audioVideo.stopLocalVideoTile();
      meetingSession.current.audioVideo.stopVideoPreviewForVideoInput(
        videoRefPreview.current
      );
      meetingSession.current.audioVideo.stopVideoPreviewForVideoInput(
        videoRefLocalTile.current
      );
      meetingSession.current.audioVideo.stop();

      if (dialogPreview) cbClose();
    }
  }, [cbClose, dialogPreview, meetingLeaving]);

  // on "open", show dialog start
  React.useEffect(() => {
    if (open) dispatch({ type: ACTION.START_OPEN });
  }, [open]);

  // on "dialogStart", browser ask permissions audio and video
  React.useEffect(() => {
    if (dialogStart) {
      // check permission AUDIO. use "try" because mediaDevices can be undefined
      try {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            stream.getTracks().forEach((track) => track.stop());
            dispatch({ type: ACTION.PERMISSION_AUDIO, value: true });
          })
          .catch(() =>
            dispatch({ type: ACTION.PERMISSION_AUDIO, value: false })
          );
      } catch {
        dispatch({ type: ACTION.PERMISSION_AUDIO, value: false });
      }

      // check permission VIDEO. use "try" because mediaDevices can be undefined
      try {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          stream.getTracks().forEach((track) => track.stop());
          dispatch({ type: ACTION.PERMISSION_VIDEO, value: true });
        });
      } catch {
        dispatch({ type: ACTION.PERMISSION_VIDEO, value: false });
      }
    }
  }, [dialogStart]);

  // on "conferenceNameToCreate" or "conferenceNameToJoin" are valued, try to join/create meet and open dialogPreview
  React.useEffect(() => {
    (async () => {
      if (conferenceNameToCreate || conferenceNameToJoin) {
        let res;

        if (conferenceNameToCreate) {
          try {
            res = await fetchJwt({
              url: `${baseUrl}/conference/create`,
              method: "POST",
              jsonBody: { productId },
            });
          } catch (err) {
            if (err.status === 401) onAuthorizationFailed(err);
            console.warn("-> Conference CREATE: ", err);
            return dispatch({
              type: ACTION.ERROR_CREATE,
              error: "Unable create a new conference",
            });
          }
        }

        if (conferenceNameToJoin) {
          try {
            res = await fetchJwt({
              url: `${baseUrl}/conference/join`,
              method: "POST",
              jsonBody: {
                conferenceName: conferenceNameToJoin.trim(),
                productId,
              },
            });
          } catch (err) {
            if (err.status === 401) onAuthorizationFailed();
            console.warn("-> Conference JOIN: ", err);
            return dispatch({
              type: ACTION.ERROR_JOIN,
              error: "Conference not found",
            });
          }
        }

        const { attendeeResponse, meetingResponse, conferenceName } = res;
        console.log({ conferenceName });
        const logger = new ConsoleLogger("MyLogger", LogLevel.ERROR);
        const deviceController = new DefaultDeviceController(logger);
        const configuration = new MeetingSessionConfiguration(
          meetingResponse,
          attendeeResponse
        );
        configuration.enableSimulcastForUnifiedPlanChromiumBasedBrowsers = simulcast;

        meetingSession.current = new DefaultMeetingSession(
          configuration,
          logger,
          deviceController
        );
        meetingSession.current.audioVideo.bindAudioElement(audioRef.current);
        meetingSession.current.audioVideo.addObserver({
          audioVideoDidStop,
          audioVideoDidStart,
        });
        meetingSession.current.audioVideo.addDeviceChangeObserver({
          audioInputsChanged,
          audioOutputsChanged,
          videoInputsChanged,
        });
        meetingSession.current.audioVideo.realtimeSubscribeToAttendeeIdPresence(
          cbRealtimeSubscribeToAttendeeIdPresence
        );

        return dispatch({ type: ACTION.PREVIEW_OPEN, id: conferenceName });
      }
      return null;
    })();
  }, [
    audioInputsChanged,
    audioOutputsChanged,
    audioVideoDidStart,
    audioVideoDidStop,
    baseUrl,
    cbRealtimeSubscribeToAttendeeIdPresence,
    conferenceNameToCreate,
    conferenceNameToJoin,
    fetchJwt,
    onAuthorizationFailed,
    productId,
    simulcast,
    videoInputsChanged,
  ]);

  // on "meetingStarting", start meetingSession
  React.useEffect(() => {
    if (meetingStarting) meetingSession.current.audioVideo.start();
  }, [meetingStarting]);

  // on "dialogPreview", try to choose audio input, output and start video preview
  React.useEffect(() => {
    (async () => {
      if (dialogPreview) {
        await audioInputsChanged();
        await audioOutputsChanged();
        await videoInputsChanged();
        meetingSession.current.audioVideo.startVideoPreviewForVideoInput(
          videoRefPreview.current
        );
        meetingSession.current.audioVideo.startVideoPreviewForVideoInput(
          videoRefLocalTile.current
        );
      }
    })();
  }, [
    audioInputsChanged,
    audioOutputsChanged,
    dialogPreview,
    videoInputsChanged,
  ]);

  // on "meetingOn" (meetingSession did start), try to start video tile
  React.useEffect(() => {
    if (meetingOn) {
      meetingSession.current.audioVideo.startLocalVideoTile();
    }
  }, [enableAudio, meetingOn]);

  // on "meetingOn", if no permissionAudio set mute to inform others attendees
  React.useEffect(() => {
    if (meetingOn && !permissionAudio) {
      meetingSession.current.audioVideo.realtimeMuteLocalAudio();
    }
  }, [meetingOn, permissionAudio]);

  return (
    <>
      <audio ref={audioRef}>
        <track kind="captions" />
      </audio>
      <ConferenceStart
        open={dialogStart}
        onClose={cbClose}
        onCreate={cbCreate}
        onJoin={cbJoin}
        onResetJoinError={cbResetJoinError}
        onResetCreateError={cbResetCreateError}
        createError={dialogErrorToCreate}
        createLoading={!!conferenceNameToCreate}
        joinError={dialogErrorToJoin}
        joinLoading={!!conferenceNameToJoin}
      />
      <ConferencePreview
        open={dialogPreview}
        conferenceName={conferenceName}
        onEnter={cbEnter}
        onClose={cbSessionLeaving}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideoPreview}
        enableAudio={enableAudio}
        enableVideo={enableVideo}
        permissionAudio={permissionAudio}
        permissionVideo={permissionVideo}
        loading={meetingStarting}
        meetingSession={meetingSession.current}
        videoRef={videoRefPreview}
      />
      <ConferenceTool
        attendeeIdMapVolume={attendeeIdMapVolume}
        open={meetingOn && !enableFullscreen}
        conferenceName={conferenceName}
        position={positionTool}
        positionPanelAttendees={positionPanelAttendees}
        attendeeIdMapUser={attendeeIdMapUser}
        onClose={cbSessionLeaving}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideoLocalTile}
        onToggleFullscreen={toggleFullscreen}
        enableAudio={enableAudio}
        enableVideo={enableVideo}
        enableFullscreen={enableFullscreen}
        permissionAudio={permissionAudio}
        permissionVideo={permissionVideo}
        meetingSession={meetingSession.current}
        videoRef={videoRefLocalTile}
      />
      {!(meetingOn && enableFullscreen) ? null : (
        <div style={{ border: "1px solid #f00" }}>
          <div children="⚠FULLSCREEN ACTIVE" />
          <Btn
            color="#f00"
            label="EXIT TO FULLSCREEN"
            onClick={toggleFullscreen}
          />
        </div>
      )}
    </>
  );
};

export default Conference;
