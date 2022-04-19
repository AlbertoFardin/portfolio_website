import * as React from "react";
import DemoChime from "../DemoChime";
import DemoConference from "../DemoConference";
import Conference from "..";

export default {
  title: "Components/WebConference",
  component: Conference,
};

const DemoConferenceStory = () => <DemoConference />;
export const Demo = DemoConferenceStory.bind({});

const DemoChimeStory = () => <DemoChime />;
export const Chime = DemoChimeStory.bind({});
