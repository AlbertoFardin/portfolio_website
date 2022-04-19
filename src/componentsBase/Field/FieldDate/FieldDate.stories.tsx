import { action } from "@storybook/addon-actions";
import * as React from "react";
import DemoFieldDate from "./Demo";
import FieldDate from ".";
import { style } from "../utils/story";

export default {
  title: "Components/Fields/FieldDate",
  component: FieldDate,
  args: {
    label: "FieldDate",
    dateFormat: "DD/MM/YYYY",
    onChange: action("onChange"),
    style,
    value: new Date("2019-05-02T22:00:00.000Z").getTime(),
  },
};

const Story = (args) => <FieldDate {...args} />;
export const Default = Story.bind({});

const DemoStory = () => <DemoFieldDate />;
export const Demo = DemoStory.bind({});
