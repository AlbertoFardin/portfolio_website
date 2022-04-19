/* eslint-disable no-undef */
import IUser from "../../IUser";
import IVolume from "../IVolume";

export enum ERROR_DEVICE {
  VIDEO = "noVideo",
  AUDIO_INPUT = "noAudioInput",
  AUDIO_OUTPUT = "noAudioOutput",
}

export enum ACTION {
  RESET = "RESET",
  ERROR_CREATE = "ERROR_CREATE",
  ERROR_JOIN = "ERROR_JOIN",
  ERROR_NO_DEVICE = "ERROR_NO_DEVICE",
  START_OPEN = "START_OPEN",
  PREVIEW_OPEN = "PREVIEW__OPEN",
  CREATE_ID = "CREATE_ID",
  JOIN_ID = "JOIN_ID",
  TOGGLE_AUDIO = "ENABLE_AUDIO",
  TOGGLE_VIDEO = "ENABLE_VIDEO",
  TOGGLE_FULLSCREEN = "TOGGLE_FULLSCREEN",
  PERMISSION_AUDIO = "PERMISSION_AUDIO",
  PERMISSION_VIDEO = "PERMISSION_VIDEO",
  MEETING_ON = "MEETING_ON",
  MEETING_STARTING = "MEETING_STARTING",
  MEETING_LEAVING = "MEETING_LEAVING",
  ATTENDEE_ADD = "ATTENDEE_ADD",
  ATTENDEE_REMOVE = "ATTENDEE_REMOVE",
  UPDATE_ROSTER_ATTENDEE_ID = "UPDATE_ROSTER_ATTENDEE_ID",
}

export interface IReducerState {
  roster: Map<
    string,
    { volume: number; muted: boolean; signalStrength: number }
  >;
  attendeeIdMapVolume: Map<string, IVolume>;
  attendeeIdMapUser: Map<string, IUser>;
  dialogStart: boolean;
  dialogPreview: boolean;
  dialogErrorToCreate: string;
  dialogErrorToJoin: string;
  dialogErrorNoDevice: {
    [ERROR_DEVICE.VIDEO]: boolean;
    [ERROR_DEVICE.AUDIO_INPUT]: boolean;
    [ERROR_DEVICE.AUDIO_OUTPUT]: boolean;
  };
  conferenceNameToCreate: string;
  conferenceNameToJoin: string;
  enableAudio: boolean;
  enableVideo: boolean;
  enableFullscreen: boolean;
  conferenceName: string;
  meetingOn: boolean;
  meetingStarting: boolean;
  meetingLeaving: boolean;
  permissionAudio: boolean;
  permissionVideo: boolean;
}

export const reducerInitState = {
  roster: new Map(),
  attendeeIdMapVolume: new Map(),
  attendeeIdMapUser: new Map(),
  dialogStart: false,
  dialogPreview: false,
  dialogErrorToCreate: "",
  dialogErrorToJoin: "",
  dialogErrorNoDevice: {
    [ERROR_DEVICE.VIDEO]: false,
    [ERROR_DEVICE.AUDIO_INPUT]: false,
    [ERROR_DEVICE.AUDIO_OUTPUT]: false,
  },
  conferenceNameToCreate: "",
  conferenceNameToJoin: "",
  enableAudio: false,
  enableVideo: false,
  enableFullscreen: false,
  conferenceName: "",
  meetingOn: false,
  meetingStarting: false,
  meetingLeaving: false,
  permissionAudio: false,
  permissionVideo: false,
};

const fixVolume = (volume: number): number => {
  const v = Math.round(volume * 100);
  switch (true) {
    case !v:
      return 0;
    case v < 30:
      return 30;
    case v < 60:
      return 60;
    case v <= 100:
      return 100;
    default:
      return 0;
  }
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.UPDATE_ROSTER_ATTENDEE_ID: {
      const newRoster = new Map(state.roster);
      const { attendeeId, volume, muted, signalStrength } = action;
      newRoster.set(attendeeId, { signalStrength, volume, muted });
      newState.roster = newRoster;
      const newAttendeeIdMuteAndChangeVolume = new Map(
        state.attendeeIdMapVolume
      );
      newAttendeeIdMuteAndChangeVolume.set(attendeeId, {
        // NB: "volume", "muted", "signalStrength" sono "null" se non cambiano
        muted:
          muted === null
            ? newState.attendeeIdMapVolume.get(attendeeId)?.muted
            : muted,
        volume:
          volume === null
            ? newState.attendeeIdMapVolume.get(attendeeId)?.volume
            : fixVolume(volume),
      });
      newState.attendeeIdMapVolume = newAttendeeIdMuteAndChangeVolume;
      return newState;
    }
    case ACTION.ATTENDEE_ADD: {
      const newAttendeeIdUserMap = new Map(state.attendeeIdMapUser);
      newAttendeeIdUserMap.set(action.attendeeId, action.user);
      newState.attendeeIdMapUser = newAttendeeIdUserMap;
      return newState;
    }
    case ACTION.ATTENDEE_REMOVE: {
      const newAttendeeIdUserMap = new Map(state.attendeeIdMapUser);
      newAttendeeIdUserMap.delete(action.attendeeId);
      const newRoster = new Map(state.roster);
      newRoster.delete(action.attendeeId);
      newState.roster = newRoster;
      newState.attendeeIdMapUser = newAttendeeIdUserMap;
      const newAttendeeIdMuteAndChangeVolume = new Map(
        state.attendeeIdMapVolume
      );
      newAttendeeIdMuteAndChangeVolume.delete(action.attendeeId);
      newState.attendeeIdMapVolume = newAttendeeIdMuteAndChangeVolume;
      return newState;
    }
    case ACTION.START_OPEN:
      newState.dialogStart = true;
      return newState;
    case ACTION.PREVIEW_OPEN:
      return {
        ...reducerInitState,
        permissionAudio: newState.permissionAudio,
        permissionVideo: newState.permissionVideo,
        enableAudio: newState.enableAudio,
        enableVideo: newState.enableVideo,
        dialogPreview: true,
        conferenceName: action.id,
      };
    case ACTION.JOIN_ID:
      newState.conferenceNameToJoin = action.id;
      return newState;
    case ACTION.CREATE_ID:
      newState.conferenceNameToCreate = action.id;
      return newState;
    case ACTION.ERROR_JOIN:
      newState.conferenceNameToCreate = "";
      newState.conferenceNameToJoin = "";
      newState.dialogErrorToCreate = "";
      newState.dialogErrorToJoin = action.error || "";
      return newState;
    case ACTION.ERROR_CREATE:
      newState.conferenceNameToCreate = "";
      newState.conferenceNameToJoin = "";
      newState.dialogErrorToCreate = action.error || "";
      newState.dialogErrorToJoin = "";
      return newState;
    case ACTION.ERROR_NO_DEVICE:
      newState.dialogErrorNoDevice = {
        ...newState.dialogErrorNoDevice,
        [action.error]: true,
      };
      return newState;
    case ACTION.PERMISSION_AUDIO:
      newState.permissionAudio = action.value;
      newState.enableAudio = action.value;
      return newState;
    case ACTION.PERMISSION_VIDEO:
      newState.permissionVideo = action.value;
      newState.enableVideo = action.value;
      return newState;
    case ACTION.TOGGLE_AUDIO:
      newState.enableAudio = newState.permissionAudio
        ? !newState.enableAudio
        : false;
      return newState;
    case ACTION.TOGGLE_VIDEO:
      newState.enableVideo = newState.permissionVideo
        ? !newState.enableVideo
        : false;
      return newState;
    case ACTION.TOGGLE_FULLSCREEN:
      newState.enableFullscreen = !newState.enableFullscreen;
      return newState;
    case ACTION.MEETING_STARTING:
      newState.meetingStarting = true;
      return newState;
    case ACTION.MEETING_ON:
      newState.dialogPreview = false;
      newState.meetingOn = true;
      newState.meetingStarting = false;
      return newState;
    case ACTION.MEETING_LEAVING:
      newState.meetingOn = false;
      newState.meetingLeaving = true;
      return newState;
    case ACTION.RESET:
      return reducerInitState;
    default:
      console.error(`no action ${action.type}`);
      return state;
  }
};

export default reducer;
