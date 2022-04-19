import MeetingSession from "amazon-chime-sdk-js/build/meetingsession/MeetingSession";
import IUser from "../../IUser";

export interface IConferencePreview {
  open: boolean;
  conferenceName: string;
  onEnter: () => void;
  onClose: () => void;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  enableAudio?: boolean;
  enableVideo?: boolean;
  permissionAudio?: boolean;
  permissionVideo?: boolean;
  loading?: boolean;
  videoRef?: React.MutableRefObject<HTMLVideoElement>;
  meetingSession: MeetingSession;
  attendees?: IUser[];
}
