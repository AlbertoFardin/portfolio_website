import * as React from "react";
import ConferenceStart from ".";
import { action } from "@storybook/addon-actions";

export default {
  title: "Components/WebConference/ConferenceStart",
  component: ConferenceStart,
};

const Story = () => (
  <ConferenceStart
    open
    onClose={action("onClose")}
    onCreate={action("onCreate")}
    onJoin={action("onJoin")}
    onResetJoinError={action("onResetJoinError")}
    onResetCreateError={action("onResetCreateError")}
  />
);

export const Example = Story.bind({});
