/* eslint-disable jsx-a11y/media-has-caption */
import * as React from "react";
import * as fetch from "isomorphic-fetch";
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
  DefaultModality,
  DefaultActiveSpeakerPolicy,
} from "amazon-chime-sdk-js";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { v4 as uuidv4 } from "uuid";
import FieldSelect from "../Field/FieldSelect";

const getInputDevices = async (meetingSession) => {
  const audioInputDevices = await meetingSession.audioVideo.listAudioInputDevices();
  const audioOutputDevices = await meetingSession.audioVideo.listAudioOutputDevices();
  const videoInputDevices = await meetingSession.audioVideo.listVideoInputDevices();

  // An array of audioInputDevices objects
  audioInputDevices.forEach((mediaDeviceInfo) => {
    console.log(
      `audioInputDevices:Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`
    );
  });

  // An array of audioOutputDevices objects
  audioOutputDevices.forEach((mediaDeviceInfo) => {
    console.log(
      `audioOutputDevices:Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`
    );
  });

  // An array of videoInputDevices objects
  videoInputDevices.forEach((mediaDeviceInfo) => {
    console.log(
      `videoInputDevices:Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`
    );
  });

  return { audioInputDevices, audioOutputDevices, videoInputDevices };
};

const DemoChime = () => {
  const audioRef = React.useRef(null);
  const videoRef = React.useRef(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [meetingSession, setMeetingSession] = React.useState({} as any);

  const [audioInputDevices, setAudioInputDevices] = React.useState([]);
  const [audioOutputDevices, setAudioOutputDevices] = React.useState([]);
  const [videoInputDevices, setVideoInputDevices] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      console.log("demochieme:", process.env);
      const urlToRequestNewMeeting = `http://${process.env.LOCAL_IP}:3000/conference/join`;

      let attendeeResponse;
      let meetingResponse;

      const createMeetSerialized = localStorage.getItem("create-meet");

      if (createMeetSerialized && meetingResponse) {
        const res = JSON.parse(createMeetSerialized);
        attendeeResponse = res.attendeeResponse;
        meetingResponse = res.meetingResponse;
      } else {
        const res = await fetch(urlToRequestNewMeeting, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ conferenceName: uuidv4() }),
        }).then((response) => response.json());
        attendeeResponse = res.attendeeResponse;
        meetingResponse = res.meetingResponse;
        localStorage.setItem(
          "create-meet",
          JSON.stringify({ attendeeResponse, meetingResponse })
        );
      }

      const logger = new ConsoleLogger("MyLogger", LogLevel.ERROR);
      const deviceController = new DefaultDeviceController(logger);

      const configuration = new MeetingSessionConfiguration(
        meetingResponse,
        attendeeResponse
      );

      const meetingSession = new DefaultMeetingSession(
        configuration,
        logger,
        deviceController
      );

      setMeetingSession(meetingSession);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      if (meetingSession.audioVideo) {
        const videoInputDevices = await meetingSession.audioVideo.listVideoInputDevices();

        // The camera LED light will turn on indicating that it is now capturing.
        // See the "Device" section for details.
        await meetingSession.audioVideo.chooseVideoInputDevice(
          videoInputDevices[0].deviceId
        );

        const observer = {
          // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
          videoTileDidUpdate: (tileState) => {
            // Ignore a tile without attendee ID and other attendee's tile.
            if (!tileState.boundAttendeeId || !tileState.localTile) {
              return;
            }

            meetingSession.audioVideo.bindVideoElement(
              tileState.tileId,
              videoRef.current
            );
          },
        };

        meetingSession.audioVideo.addObserver(observer);
      }
    })();
  }, [meetingSession]);

  const onClickListDevices = React.useCallback(async () => {
    const {
      audioInputDevices,
      audioOutputDevices,
      videoInputDevices,
    } = await getInputDevices(meetingSession);
    setAudioInputDevices(
      audioInputDevices.map(({ deviceId, label }) => ({
        id: deviceId,
        label,
        selected: false,
      }))
    );
    setAudioOutputDevices(
      audioOutputDevices.map(({ deviceId, label }) => ({
        id: deviceId,
        label,
        selected: false,
      }))
    );
    setVideoInputDevices(
      videoInputDevices.map(({ deviceId, label }) => ({
        id: deviceId,
        label,
        selected: false,
      }))
    );
  }, [meetingSession]);

  const onClickStartLocalVideo = React.useCallback(() => {
    if (meetingSession && meetingSession.audioVideo) {
      meetingSession.audioVideo.startLocalVideoTile();
    }
  }, [meetingSession]);

  const onClickAudioSession = React.useCallback(() => {
    meetingSession.audioVideo.bindAudioElement(audioRef.current);

    const observer = {
      audioVideoDidStart: () => {
        console.log("Started");
      },
    };

    meetingSession.audioVideo.addObserver(observer);

    meetingSession.audioVideo.start();
  }, [meetingSession.audioVideo]);

  const onChangeSetAudioInputDevice = React.useCallback(
    async (item) => {
      setAudioInputDevices(
        audioInputDevices.map((i) => {
          if (i.id === item.id) {
            i.selected = true;
          } else {
            i.selected = false;
          }
          return i;
        })
      );
      await meetingSession.audioVideo.chooseAudioInputDevice(item.id);
    },
    [audioInputDevices, meetingSession.audioVideo]
  );

  const onChangeSetAudioOutputDevice = React.useCallback(
    async (item) => {
      setAudioOutputDevices(
        audioOutputDevices.map((i) => {
          if (i.id === item.id) {
            i.selected = true;
          } else {
            i.selected = false;
          }
          return i;
        })
      );
      await meetingSession.audioVideo.chooseAudioOutputDevice(item.id);
    },
    [audioOutputDevices, meetingSession.audioVideo]
  );

  const onChangeSetVideoInputDevice = React.useCallback(
    async (item) => {
      setVideoInputDevices(
        videoInputDevices.map((i) => {
          if (i.id === item.id) {
            i.selected = true;
          } else {
            i.selected = false;
          }
          return i;
        })
      );
      await meetingSession.audioVideo.chooseVideoInputDevice(item.id);
    },
    [meetingSession.audioVideo, videoInputDevices]
  );

  const [
    freshAudioInputDeviceList,
    setFreshAudioInputDeviceList,
  ] = React.useState([]);
  const [
    freshAudioOutputDeviceList,
    setFreshAudioOutputDeviceList,
  ] = React.useState([]);
  const [
    freshVideoInputDeviceList,
    setFreshVideoInputDeviceList,
  ] = React.useState([]);

  // Use case 4
  React.useEffect(() => {
    if (meetingSession.audioVideo) {
      meetingSession.audioVideo.addDeviceChangeObserver({
        audioInputsChanged: (freshAudioInputDeviceList) => {
          // An array of MediaDeviceInfo objects
          setFreshAudioInputDeviceList(freshAudioInputDeviceList);
        },
        audioOutputsChanged: (freshAudioOutputDeviceList) => {
          setFreshAudioOutputDeviceList(freshAudioOutputDeviceList);
        },
        videoInputsChanged: (freshVideoInputDeviceList) => {
          setFreshVideoInputDeviceList(freshVideoInputDeviceList);
        },
      });
    }
  }, [meetingSession.audioVideo]);

  // Use case 6
  const [sessionEvent, setSessionEvent] = React.useState("undefined");
  React.useEffect(() => {
    if (meetingSession.audioVideo) {
      const observer = {
        audioVideoDidStart: () => {
          setSessionEvent("Started");
        },
        audioVideoDidStop: (sessionStatus) => {
          // See the "Stopping a session" section for details.
          setSessionEvent(
            `Stopped with a session status code: ${sessionStatus.statusCode()}`
          );
        },
        audioVideoDidStartConnecting: (reconnecting) => {
          if (reconnecting) {
            // e.g. the WiFi connection is dropped.
            setSessionEvent("Attempting to reconnect");
          }
        },
      };

      meetingSession.audioVideo.addObserver(observer);
    }
  }, [meetingSession.audioVideo]);

  // Use case 7
  const [statusMute, setStatusMute] = React.useState(false);
  const onChangeMuteUnmute = React.useCallback(() => {
    // Mute
    if (!statusMute) {
      meetingSession.audioVideo.realtimeMuteLocalAudio();
      setStatusMute(true);
    } else {
      // Unmute
      const unmuted = meetingSession.audioVideo.realtimeUnmuteLocalAudio();
      if (unmuted) {
        setStatusMute(false);
      } else {
        // See the realtimeSetCanUnmuteLocalAudio use case below.
        console.error("You cannot unmute yourself");
      }
    }
  }, [meetingSession.audioVideo, statusMute]);

  // Use case 10
  const [volume, setVolume] = React.useState(0);
  const [signalStrength, setSignalStrength] = React.useState(0);

  React.useEffect(() => {
    if (meetingSession.audioVideo && meetingSession.configuration) {
      // This is your attendee ID. You can also subscribe to another attendee's ID.
      // See the "Attendees" section for an example on how to retrieve other attendee IDs
      // in a session.
      const presentAttendeeId =
        meetingSession.configuration.credentials.attendeeId;
      meetingSession.audioVideo.realtimeSubscribeToVolumeIndicator(
        presentAttendeeId,
        (attendeeId, volume, muted, signalStrength) => {
          const baseAttendeeId = new DefaultModality(attendeeId).base();
          if (baseAttendeeId !== attendeeId) {
            // See the "Screen and content share" section for details.
            console.log(`The volume of ${baseAttendeeId}'s content changes`);
          }

          setVolume(volume);
          setSignalStrength(signalStrength);
          // A null value for any field means that it has not changed.
        }
      );
    }
  }, [meetingSession.audioVideo, meetingSession.configuration]);

  // Use case 11
  const [mostActiveAttendeesIds, setMostActiveAttendeesIds] = React.useState(
    []
  );

  React.useEffect(() => {
    if (meetingSession.audioVideo) {
      const activeSpeakerCallback = (attendeeIds) => {
        if (attendeeIds.length) {
          console.log(`${attendeeIds[0]} is the most active speaker`);
          setMostActiveAttendeesIds(attendeeIds);
        }
      };

      meetingSession.audioVideo.subscribeToActiveSpeakerDetector(
        new DefaultActiveSpeakerPolicy(),
        activeSpeakerCallback
      );
    }
  }, [meetingSession.audioVideo]);

  // Use case 16. Start sharing your screen.
  const alreadyRequestShareScreen = React.useRef(false);
  const onClickStartShareMyScreen = React.useCallback(async () => {
    if (meetingSession.audioVideo && !alreadyRequestShareScreen.current) {
      alreadyRequestShareScreen.current = true;
      await meetingSession.audioVideo.startContentShareFromScreenCapture();
    }
  }, [meetingSession.audioVideo]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: 10,
        width: "inherit",
        height: "inherit",
        overflowY: "scroll",
      }}
    >
      <Typography variant="h2" component="h2">
        Device
      </Typography>
      <Button variant="contained" color="primary" onClick={onClickListDevices}>
        Use case 1. Populate audio input, audio output, and video input devices.
        The browser will ask for microphone and camera permissions.
      </Button>
      <FieldSelect
        label="Use case 2. Choose audio input"
        placeholder="Select an audioInputDevices..."
        readOnly={audioInputDevices.length === 0}
        itemsSelectedMaxLength={1}
        value={audioInputDevices}
        style={{ width: 275, paddingTop: 10 }}
        onChange={onChangeSetAudioInputDevice}
      />
      <FieldSelect
        label="Use case 2. Choose audio output"
        placeholder="Select an audioOutputDevices..."
        readOnly={audioInputDevices.length === 0}
        itemsSelectedMaxLength={1}
        value={audioOutputDevices}
        style={{ width: 275, paddingTop: 10 }}
        onChange={onChangeSetAudioOutputDevice}
      />
      <FieldSelect
        label="Use case 3. Choose video input"
        placeholder="Select an videoInputDevices..."
        readOnly={audioInputDevices.length === 0}
        itemsSelectedMaxLength={1}
        value={videoInputDevices}
        style={{ width: 275, paddingTop: 10 }}
        onChange={onChangeSetVideoInputDevice}
      />
      <Typography variant="body1" component="h2">
        Use case 4. Add a device change observer to receive the updated device
        list. For example, when you pair Bluetooth headsets with your computer,
        audioInputsChanged and audioOutputsChanged are called with the device
        list including headsets.
      </Typography>
      <Typography variant="body2" component="h2">
        audioInputsChanged
        {freshAudioInputDeviceList.length !== 0 ? (
          freshAudioInputDeviceList.map(({ deviceId, label }) => (
            <div key={deviceId}>
              {"ID: "}
              {deviceId}
              {" - LABEL: "}
              {label}
            </div>
          ))
        ) : (
          <div>{" - nothing change"}</div>
        )}
      </Typography>
      <Typography variant="body2" component="h2">
        audioOutputsChanged
        {freshAudioOutputDeviceList.length !== 0 ? (
          freshAudioOutputDeviceList.map(({ deviceId, label }) => (
            <div key={deviceId}>
              {"ID: "}
              {deviceId}
              {" - LABEL: "}
              {label}
            </div>
          ))
        ) : (
          <div>{" - nothing change"}</div>
        )}
      </Typography>
      <Typography variant="body2" component="h2">
        videoInputsChanged
        {freshVideoInputDeviceList.length !== 0 ? (
          freshVideoInputDeviceList.map(({ deviceId, label }) => (
            <div key={deviceId}>
              {"ID: "}
              {deviceId}
              {" - LABEL: "}
              {label}
            </div>
          ))
        ) : (
          <div>{" - nothing change"}</div>
        )}
      </Typography>
      <Typography variant="h2" component="h2">
        Starting a session
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onClickAudioSession}
        style={{ marginTop: 10 }}
      >
        {`Use case 5. Start a session. To hear audio, you need to bind a device and stream 
        to an <audio> element. Once the session has started, you can talk and listen to attendees. 
          Make sure you have chosen your microphone and speaker (See the "Device" section), 
          and at least one other attendee has joined the session.`}
      </Button>
      <Typography variant="body1" component="h2" style={{ marginTop: 10 }}>
        Use case 6. Add an observer to receive session lifecycle events:
        connecting, start, and stop.
      </Typography>
      <Typography variant="body2" component="h2">
        {sessionEvent}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onChangeMuteUnmute}
        style={{ marginTop: 10 }}
      >
        Use case 7. Mute and unmute an audio input.
      </Button>
      <Typography variant="body2" component="h2">
        {statusMute ? "Mute" : "Unmute"}
      </Typography>
      <Typography variant="body1" component="h2" style={{ marginTop: 10 }}>
        Use case 10. Subscribe to volume changes of a specific attendee. You can
        use this to build a real-time volume indicator UI. NOTE: CLICK IN
        SEQUENCE 1) BUTTON USE CASE 5, 2) BUTTON USE CASE 1
      </Typography>
      <Typography variant="body2" component="h2">
        {`Volume: ${Math.round(
          volume * 100
        )} and Signal Strength: ${signalStrength}`}
      </Typography>
      <Typography variant="body1" component="h2" style={{ marginTop: 10 }}>
        {`Use case 11. Detect the most active speaker.
      For example, you can enlarge the active speaker\'s video element if available.`}
      </Typography>
      <Typography variant="body2" component="h2">
        {`Most active attendeeIds: ${mostActiveAttendeesIds.join()}`}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={onClickStartLocalVideo}
        style={{ marginTop: 10 }}
      >
        Use case 12. Start sharing your video
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={onClickStartLocalVideo}
        style={{ marginTop: 10 }}
      >
        Use case 13. Stop sharing your video
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={onClickStartShareMyScreen}
        style={{ marginTop: 10 }}
      >
        Use case 16. Start sharing your screen.
      </Button>

      <video
        style={{
          padding: 10,
          width: 200,
          height: 200,
          borderRadius: "50%",
          objectFit: "cover",
        }}
        ref={videoRef}
      ></video>
      <audio ref={audioRef}></audio>
    </div>
  );
};
export default DemoChime;
