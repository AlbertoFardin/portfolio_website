import * as React from "react";
import { action } from "@storybook/addon-actions";
import { urlImage } from "../__stories__/mediaUrls";
import Chip from ".";

export default {
  title: "Components/Chip",
  component: Chip,
  argTypes: {
    colorTheme: { control: "color" },
  },
  args: {
    colorTheme: "#00f",
    label: "label",
    onClick: action("onClick"),
  },
};

const Story = (args) => (
  <>
    <Chip {...args} selected={true} />
    <br />
    <Chip {...args} selected={false} />
  </>
);

export const Default = Story.bind({});

export const Ellipsised = Story.bind({});
Ellipsised.args = {
  label:
    "long label long label long label long label long label long label long label ",
};

export const WithButtonRemove = Story.bind({});
WithButtonRemove.args = {
  onRemove: action("onRemove"),
};

export const WithAvatar = Story.bind({});
WithAvatar.args = {
  avatar: urlImage,
};
