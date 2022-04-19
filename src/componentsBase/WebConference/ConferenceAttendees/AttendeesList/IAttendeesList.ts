import { MeetingSession } from "amazon-chime-sdk-js";
import IVolume from "../../IVolume";
import IAttendee from "../IAttendee";

export interface IAttendeesList {
  attendees: IAttendee[];
  meetingSession: MeetingSession;
  attendeeIdMapVolume: Map<string, IVolume>;
}
