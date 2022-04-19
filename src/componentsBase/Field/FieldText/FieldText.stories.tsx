import { action } from "@storybook/addon-actions";
import * as React from "react";
import DemoFieldText from "./Demo";
import FieldText from ".";
import { style } from "../utils/story";

export default {
  title: "Components/Fields/FieldText",
  component: FieldText,
  args: {
    label: "FieldText",
    onKeyPress: action("onKeyPress"),
    onChange: action("onChange"),
    onBlur: action("onBlur"),
    onFocus: action("onFocus"),
    style,
    value: "Once Upon a Time,\nthere are a little girl called Red Hood",
    multiline: true,
  },
};

const Story = (args) => <FieldText {...args} />;
export const Default = Story.bind({});

const DemoStory = () => <DemoFieldText />;
export const Demo = DemoStory.bind({});
