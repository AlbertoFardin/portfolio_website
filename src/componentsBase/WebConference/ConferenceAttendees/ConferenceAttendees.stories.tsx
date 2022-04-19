import * as React from "react";
import ConferenceAttendees from ".";
import { action } from "@storybook/addon-actions";

const getUser = (userId: string) => {
  const id = userId.substr(0, 3); // use this for demo
  return {
    id,
    firstName: `${id}_firstName`,
    lastName: `${id}_lastName`,
    picture: `https://loremflickr.com/200/200?random=${id}`,
    attendeeId: id,
  };
};
const meetingSession = {
  configuration: null,
  logger: null,
  audioVideo: null,
  contentShare: null,
  screenShare: null,
  screenShareView: null,
  deviceController: null,
};

export default {
  title: "Components/WebConference/ConferenceAttendees",
  component: ConferenceAttendees,
};

const Story = () => (
  <ConferenceAttendees
    attendeeIdMapVolume={new Map()}
    open
    position={{ top: 50, right: 0, left: 0 }}
    onClose={action("onClose")}
    attendees={Array.from({ length: 10 }).map((a, x) => getUser(String(x)))}
    meetingSession={meetingSession}
  />
);

export const Example = Story.bind({});
