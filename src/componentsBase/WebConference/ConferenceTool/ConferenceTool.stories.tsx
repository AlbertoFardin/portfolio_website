import * as React from "react";
import ConferenceTool from ".";
import { action } from "@storybook/addon-actions";

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
  title: "Components/WebConference/ConferenceTool",
  component: ConferenceTool,
};

const Story = () => (
  <ConferenceTool
    attendeeIdMapVolume={new Map()}
    open
    conferenceName="b926b5e6-c20f-4ff7-be21-20bb2a94dbb6"
    position={{ top: 50, right: 0, left: 0 }}
    onClose={action("onClose")}
    onToggleAudio={action("onToggleAudio")}
    onToggleVideo={action("onToggleVideo")}
    onToggleFullscreen={action("onToggleFullscreen")}
    enableAudio
    enableVideo
    meetingSession={meetingSession}
  />
);

export const Example = Story.bind({});
