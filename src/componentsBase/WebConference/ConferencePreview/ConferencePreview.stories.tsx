import * as React from "react";
import ConferencePreview from ".";
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
  title: "Components/WebConference/ConferencePreview",
  component: ConferencePreview,
};

const Story = () => (
  <ConferencePreview
    open
    conferenceName="b926b5e6-c20f-4ff7-be21-20bb2a94dbb6"
    onEnter={action("onEnter")}
    onClose={action("onClose")}
    onToggleAudio={action("onToggleAudio")}
    onToggleVideo={action("onToggleVideo")}
    enableAudio
    enableVideo
    permissionAudio
    permissionVideo
    attendees={Array.from({ length: 10 }).map((a, x) => getUser(String(x)))}
    meetingSession={meetingSession}
  />
);

export const Example = Story.bind({});
