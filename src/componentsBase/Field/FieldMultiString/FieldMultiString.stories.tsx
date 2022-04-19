import { action } from "@storybook/addon-actions";
import * as React from "react";
import DemoFieldMultiString from "./Demo";
import FieldMultiString from ".";
import { style } from "../utils/story";

const value = [];
for (let i = 0; i < 35; i++) {
  const id = `item_${i}`;
  value.push({ id, label: id });
}

export default {
  title: "Components/Fields/FieldMultiString",
  component: FieldMultiString,
  args: {
    label: "FieldMultiString",
    onChange: action("onChange"),
    style,
    value,
  },
};

const Story = (args) => <FieldMultiString {...args} />;
export const Default = Story.bind({});

const DemoStory = () => <DemoFieldMultiString />;
export const Demo = DemoStory.bind({});
