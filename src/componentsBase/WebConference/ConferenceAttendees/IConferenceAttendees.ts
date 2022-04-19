import MeetingSession from "amazon-chime-sdk-js/build/meetingsession/MeetingSession";
import IVolume from "../IVolume";
import IAttendee from "./IAttendee";

export interface IConferenceAttendees {
  open: boolean;
  position?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  onClose: () => void;
  attendees: IAttendee[];
  meetingSession: MeetingSession;
  attendeeIdMapVolume: Map<string, IVolume>;
}
